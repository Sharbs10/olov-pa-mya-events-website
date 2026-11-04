import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

const MCF_BOOKS_PDF_BASE_URL =
  'https://raw.githubusercontent.com/Sharbs10/olov-pa-mya-events-website/SharbsDev/public/assets/mcf/books';

@Component({
  selector: 'app-mcf-book-chapter',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './mcf-book-chapter.component.html',
  styleUrl: './mcf-book-chapter.component.css'
})
export class McfBookChapterComponent implements OnDestroy {
  readonly chapterNumber: number | null;
  readonly pdfPath: string;
  pdfUrl: SafeResourceUrl | null = null;
  pdfLoading = true;
  pdfMissing = false;
  private readonly pdfRequest = new AbortController();
  private pdfObjectUrl: string | null = null;

  constructor(
    route: ActivatedRoute,
    sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    const chapter = route.snapshot.paramMap.get('chapter')?.toLowerCase() ?? '';
    const match = /^ch([1-8])$/.exec(chapter);
    this.chapterNumber = match ? Number(match[1]) : null;
    this.pdfPath = this.chapterNumber
      ? `${MCF_BOOKS_PDF_BASE_URL}/ch${this.chapterNumber}.pdf`
      : '';

    if (this.pdfPath && isPlatformBrowser(platformId)) {
      void fetch(this.pdfPath, { signal: this.pdfRequest.signal })
        .then(async response => {
          if (!response.ok) {
            this.pdfMissing = true;
            return;
          }

          const pdf = await response.blob();
          this.pdfObjectUrl = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
          this.pdfUrl = sanitizer.bypassSecurityTrustResourceUrl(this.pdfObjectUrl);
        })
        .catch(error => {
          if (this.pdfRequest.signal.aborted) {
            return;
          }
          console.error('Could not check the MCF chapter PDF:', error);
          this.pdfMissing = true;
        })
        .finally(() => {
          this.pdfLoading = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.pdfRequest.abort();
    if (this.pdfObjectUrl) {
      URL.revokeObjectURL(this.pdfObjectUrl);
    }
  }
}
