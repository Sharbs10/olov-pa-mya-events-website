import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist';
import { HeaderComponent } from '../../shared/header/header.component';

const MCF_BOOKS_PDF_BASE_URL =
  'https://raw.githubusercontent.com/Sharbs10/olov-pa-mya-events-website/SharbsDev/public/assets/mcf/books';
const MCF_GRADE_TITLES = [
  'GOD IS LOVE',
  'JESUS',
  'THE CHURCH',
  'FOLLOWING JESUS',
  "THE CHURCH'S LITURGY",
  'THE BIBLE',
  'OUR MARONITE FAITH',
  'OUR MARONITE CHURCH HISTORY'
] as const;

interface ChapterPage {
  number: number;
  aspectRatio: string;
  pdfPage: PDFPageProxy;
}

@Component({
  selector: 'app-mcf-book-chapter',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './mcf-book-chapter.component.html',
  styleUrl: './mcf-book-chapter.component.css'
})
export class McfBookChapterComponent implements AfterViewInit, OnDestroy {
  readonly chapterNumber: number | null;
  readonly gradeTitle: string | null;
  readonly pdfPath: string;
  readonly pages: ChapterPage[] = [];
  pdfLoading = true;
  pdfMissing = false;
  downloadProgress: number | null = 0;
  isPreparingPages = false;
  preparedPageCount = 0;
  totalPageCount = 0;
  loadingMessage = 'Downloading the complete PDF…';
  isFullscreen = false;
  @ViewChild('pdfViewer') private pdfViewer?: ElementRef<HTMLDivElement>;
  currentPage = 1;
  zoomFactor = 1;
  @ViewChild('chapterPage') private chapterPage?: ElementRef<HTMLElement>;
  @ViewChild('pdfContainer') private pdfContainer?: ElementRef<HTMLDivElement>;
  @ViewChildren('pageCanvas') private pageCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChildren('pdfPage') private pdfPageElements!: QueryList<ElementRef<HTMLElement>>;
  private readonly pdfRequest = new AbortController();
  private pdfLoadingTask: PDFDocumentLoadingTask | null = null;
  private pdfDocument: PDFDocumentProxy | null = null;
  private pageObserver: IntersectionObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private readonly renderTasks = new Map<number, RenderTask>();
  private readonly renderedCanvases = new Map<number, HTMLCanvasElement>();
  private pageCanvasSubscription?: { unsubscribe(): void };
  private containerWidth = 0;
  private destroyed = false;

  constructor(
    route: ActivatedRoute,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly changeDetector: ChangeDetectorRef
  ) {
    const chapter = route.snapshot.paramMap.get('chapter')?.toLowerCase() ?? '';
    const match = /^ch([1-8])$/.exec(chapter);
    this.chapterNumber = match ? Number(match[1]) : null;
    this.gradeTitle = this.chapterNumber ? MCF_GRADE_TITLES[this.chapterNumber - 1] : null;
    this.pdfPath = this.chapterNumber
      ? `${MCF_BOOKS_PDF_BASE_URL}/ch${this.chapterNumber}.pdf`
      : '';

    if (this.pdfPath && isPlatformBrowser(this.platformId)) {
      void this.loadPdf();
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.pageCanvasSubscription = this.pageCanvases.changes.subscribe(() => this.observeCanvases());
    this.resizeObserver = new ResizeObserver(() => this.handleContainerResize());
    if (this.pdfContainer) {
      this.resizeObserver.observe(this.pdfContainer.nativeElement);
    }
    this.observeCanvases();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.pdfRequest.abort();
    this.pageCanvasSubscription?.unsubscribe();
    this.pageObserver?.disconnect();
    this.resizeObserver?.disconnect();
    for (const task of this.renderTasks.values()) {
      task.cancel();
    }
    this.renderTasks.clear();
    void this.pdfLoadingTask?.destroy();
    void this.pdfDocument?.destroy();
  }

  get pageWidth(): number {
    return Math.min(this.pdfContainer?.nativeElement.clientWidth ?? 0, 1024) * this.zoomFactor;
  }

  get zoomPercent(): number {
    return Math.round(this.zoomFactor * 100);
  }

  goToPage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const requestedPage = Number.parseInt(input.value, 10);
    if (!Number.isFinite(requestedPage)) {
      input.value = String(this.currentPage);
      return;
    }

    this.goToPageValue(requestedPage);
    input.value = String(this.currentPage);
  }

  goToPageValue(requestedPage: number): void {
    this.currentPage = Math.max(1, Math.min(this.pages.length, requestedPage));
    const pageElement = this.pdfPageElements.get(this.currentPage - 1)?.nativeElement;
    pageElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    this.renderPageWindow(this.currentPage);
  }

  updateCurrentPage(): void {
    const viewport = (this.isFullscreen
      ? this.pdfContainer
      : this.chapterPage)?.nativeElement;
    if (!viewport || !this.pdfPageElements.length) {
      return;
    }

    const viewportCenter = viewport.getBoundingClientRect().top + viewport.clientHeight / 2;
    let closestPage = this.currentPage;
    let closestDistance = Number.POSITIVE_INFINITY;
    this.pdfPageElements.forEach((element, index) => {
      const bounds = element.nativeElement.getBoundingClientRect();
      const distance = Math.abs((bounds.top + bounds.bottom) / 2 - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = index + 1;
      }
    });
    this.currentPage = closestPage;
    this.pruneRenderedPages();
  }

  zoomBy(amount: number): void {
    const nextZoom = Math.max(0.5, Math.min(2.5, this.zoomFactor + amount));
    if (nextZoom === this.zoomFactor) {
      return;
    }
    this.zoomFactor = nextZoom;
    this.refreshRenderedPages();
  }

  fitToWidth(): void {
    if (this.zoomFactor === 1) {
      return;
    }
    this.zoomFactor = 1;
    this.refreshRenderedPages();
  }

  async toggleFullscreen(): Promise<void> {
    const viewer = this.pdfViewer?.nativeElement;
    if (!viewer) {
      return;
    }

    try {
      if (document.fullscreenElement === viewer) {
        await document.exitFullscreen();
      } else {
        await viewer.requestFullscreen();
      }
    } catch (error) {
      console.error('Could not toggle the MCF PDF viewer fullscreen mode:', error);
    }
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.isFullscreen = document.fullscreenElement === this.pdfViewer?.nativeElement;
    this.createPageObserver();
    this.observeCanvases();
  }

  private async loadPdf(): Promise<void> {
    try {
      const response = await fetch(this.pdfPath, { signal: this.pdfRequest.signal });
      if (!response.ok) {
        this.pdfMissing = true;
        return;
      }

      const data = await this.readPdfData(response);
      this.isPreparingPages = true;
      this.loadingMessage = 'Opening the complete PDF…';
      this.changeDetector.detectChanges();
      const pdfjs = await import('pdfjs-dist');
      if (this.pdfRequest.signal.aborted) {
        return;
      }
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'assets/pdfjs/pdf.worker.min.mjs',
        document.baseURI
      ).toString();
      this.pdfLoadingTask = pdfjs.getDocument({
        data
      });
      this.pdfDocument = await this.pdfLoadingTask.promise;
      this.totalPageCount = this.pdfDocument.numPages;
      this.loadingMessage = 'Preparing every page…';
      this.downloadProgress = 99;
      this.changeDetector.detectChanges();

      for (let number = 1; number <= this.pdfDocument.numPages; number++) {
        const pdfPage = await this.pdfDocument.getPage(number);
        const viewport = pdfPage.getViewport({ scale: 1 });
        this.pages.push({
          number,
          aspectRatio: `${viewport.width} / ${viewport.height}`,
          pdfPage
        });
        this.preparedPageCount = number;
        if (number % 10 === 0 || number === this.pdfDocument.numPages) {
          this.changeDetector.detectChanges();
        }
      }
      this.downloadProgress = 100;
      this.isPreparingPages = false;
    } catch (error) {
      if (this.pdfRequest.signal.aborted) {
        return;
      }
      console.error('Could not load the MCF chapter PDF:', error);
      this.pdfMissing = true;
    } finally {
      if (!this.destroyed) {
        this.pdfLoading = false;
        this.changeDetector.detectChanges();
        this.createPageObserver();
        if (this.pdfContainer) {
          this.resizeObserver?.observe(this.pdfContainer.nativeElement);
        }
        this.observeCanvases();
      }
    }
  }

  private async readPdfData(response: Response): Promise<Uint8Array> {
    const contentLength = Number(response.headers.get('content-length'));
    const totalBytes = Number.isFinite(contentLength) && contentLength > 0 ? contentLength : null;
    const reader = response.body?.getReader();

    if (!reader) {
      const data = new Uint8Array(await response.arrayBuffer());
      this.downloadProgress = 100;
      return data;
    }

    const chunks: Uint8Array[] = [];
    let loadedBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
      loadedBytes += value.length;
      this.downloadProgress = totalBytes
        ? Math.min(99, Math.floor((loadedBytes / totalBytes) * 100))
        : null;
      this.changeDetector.detectChanges();
    }

    const data = new Uint8Array(loadedBytes);
    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data;
  }

  private createPageObserver(): void {
    this.pageObserver?.disconnect();
    if (!isPlatformBrowser(this.platformId) || !this.pdfContainer || !this.chapterPage) {
      return;
    }
    const root = this.isFullscreen
      ? this.pdfContainer.nativeElement
      : this.chapterPage?.nativeElement ?? null;
    this.pageObserver = new IntersectionObserver(
      entries => this.handlePageVisibility(entries),
      { root, rootMargin: '100% 0px' }
    );
  }

  private observeCanvases(): void {
    if (!this.pageObserver) {
      return;
    }
    for (const { nativeElement } of this.pageCanvases) {
      this.pageObserver.observe(nativeElement);
    }
  }

  private handlePageVisibility(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      const canvas = entry.target as HTMLCanvasElement;
      const pageNumber = Number(canvas.dataset['pageNumber']);
      const page = this.pages[pageNumber - 1];
      if (entry.isIntersecting && page) {
        this.renderPage(canvas, page);
      }
    }
  }

  private renderPageWindow(pageNumber: number): void {
    for (let number = Math.max(1, pageNumber - 1); number <= Math.min(this.pages.length, pageNumber + 1); number++) {
      const canvas = this.pageCanvases.get(number - 1)?.nativeElement;
      const page = this.pages[number - 1];
      if (canvas && page) {
        this.renderPage(canvas, page);
      }
    }
  }

  private renderPage(canvas: HTMLCanvasElement, page: ChapterPage): void {
    if (!this.pdfContainer || canvas.dataset['rendered'] || this.renderTasks.has(page.number)) {
      return;
    }

    const baseViewport = page.pdfPage.getViewport({ scale: 1 });
    const scale = (canvas.parentElement?.clientWidth ?? this.pdfContainer.nativeElement.clientWidth) /
      baseViewport.width;
    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    const viewport = page.pdfPage.getViewport({ scale: scale * outputScale });
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    canvas.style.aspectRatio = page.aspectRatio;

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      console.error(`Could not create a canvas context for MCF chapter page ${page.number}.`);
      return;
    }

    const task = page.pdfPage.render({ canvasContext, viewport });
    this.renderTasks.set(page.number, task);
    this.renderedCanvases.set(page.number, canvas);
    void task.promise.then(() => {
      if (this.renderTasks.get(page.number) === task) {
        canvas.dataset['rendered'] = 'true';
      }
    }).catch(error => {
      if (this.renderTasks.get(page.number) === task) {
        console.error(`Could not render MCF chapter page ${page.number}:`, error);
      }
    }).finally(() => {
      if (this.renderTasks.get(page.number) === task) {
        this.renderTasks.delete(page.number);
      }
    });
  }

  private clearPage(canvas: HTMLCanvasElement, pageNumber: number): void {
    const task = this.renderTasks.get(pageNumber);
    if (task) {
      this.renderTasks.delete(pageNumber);
      task.cancel();
    }
    if (this.renderedCanvases.get(pageNumber) === canvas) {
      canvas.width = 0;
      canvas.height = 0;
      delete canvas.dataset['rendered'];
      this.renderedCanvases.delete(pageNumber);
    }
  }

  private pruneRenderedPages(): void {
    for (const [pageNumber, canvas] of this.renderedCanvases) {
      if (Math.abs(pageNumber - this.currentPage) > 3) {
        this.pageObserver?.unobserve(canvas);
        this.clearPage(canvas, pageNumber);
      }
    }
  }

  private handleContainerResize(): void {
    if (!this.pdfContainer || !this.pageObserver) {
      return;
    }
    const width = this.pdfContainer.nativeElement.clientWidth;
    if (!width || width === this.containerWidth) {
      return;
    }
    this.containerWidth = width;
    for (const [pageNumber, canvas] of this.renderedCanvases) {
      this.pageObserver.unobserve(canvas);
      this.clearPage(canvas, pageNumber);
      this.pageObserver.observe(canvas);
    }
    this.renderPageWindow(this.currentPage);
  }

  private refreshRenderedPages(): void {
    const canvases = [...this.renderedCanvases.entries()];
    for (const [pageNumber, canvas] of canvases) {
      this.pageObserver?.unobserve(canvas);
      this.clearPage(canvas, pageNumber);
    }
    this.changeDetector.detectChanges();
    for (const [pageNumber, canvas] of canvases) {
      const page = this.pages[pageNumber - 1];
      if (page) {
        this.renderPage(canvas, page);
        this.pageObserver?.observe(canvas);
      }
    }
  }
}
