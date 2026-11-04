import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { PDFDocument } from 'pdf-lib';
import { McfBookChapterComponent } from './mcf-book-chapter.component';

describe('McfBookChapterComponent', () => {
  it('displays the longest grade title in the heading', async () => {
    await TestBed.configureTestingModule({
      imports: [McfBookChapterComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ chapter: 'ch8' }) } }
        },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(McfBookChapterComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent?.trim())
      .toBe('Grade 8: OUR MARONITE CHURCH HISTORY');
    expect(element.querySelector('app-footer')).toBeNull();

    fixture.destroy();
  });

  it('renders every PDF page at its original aspect ratio and provides a download link', async () => {
    const pdf = await PDFDocument.create();
    pdf.addPage([612, 792]);
    pdf.addPage([792, 612]);
    const pdfData = await pdf.save();
    let resolveResponse!: (response: Response) => void;
    spyOn(window, 'fetch').and.returnValue(new Promise(resolve => {
      resolveResponse = resolve;
    }));

    await TestBed.configureTestingModule({
      imports: [McfBookChapterComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ chapter: 'ch3' }) } }
        },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(McfBookChapterComponent);
    fixture.detectChanges();
    const loading = fixture.nativeElement as HTMLElement;
    expect(loading.querySelector('[role="status"]')?.textContent).toContain('Downloading the complete PDF');
    expect(loading.querySelector('[aria-label="PDF controls"]')).toBeNull();
    expect(loading.querySelector<HTMLAnchorElement>('.pdf-download-button')).toBeNull();

    resolveResponse(new Response(pdfData, { status: 200 }));
    await new Promise<void>(resolve => {
      const interval = window.setInterval(() => {
        if (!fixture.componentInstance.pdfLoading) {
          window.clearInterval(interval);
          resolve();
        }
      }, 10);
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Grade 3: THE CHURCH');
    expect(getComputedStyle(element.querySelector('main')!).overflowY).toBe('auto');
    const pages = element.querySelectorAll<HTMLElement>('.pdf-page');
    expect(pages.length).toBe(2);
    expect(pages[0].style.aspectRatio).toBe('612 / 792');
    expect(pages[1].style.aspectRatio).toBe('792 / 612');
    expect(element.querySelector('[aria-label="PDF controls"]')).not.toBeNull();
    expect(element.querySelector<HTMLButtonElement>('[aria-label="Previous page"]')?.disabled).toBeTrue();
    expect(element.querySelector('[aria-label="Next page"]')).not.toBeNull();
    expect(element.querySelector('[aria-label="Full screen"]')).not.toBeNull();
    expect(element.querySelector<HTMLAnchorElement>('.pdf-download-button')?.getAttribute('href'))
      .toBe('https://raw.githubusercontent.com/Sharbs10/olov-pa-mya-events-website/SharbsDev/public/assets/mcf/books/ch3.pdf');
    expect(element.querySelector<HTMLAnchorElement>('.pdf-download-button')?.getAttribute('download'))
      .toBe('Grade 3 - THE CHURCH.pdf');

    element.querySelector<HTMLButtonElement>('[aria-label="Zoom in"]')?.click();
    fixture.detectChanges();
    expect(element.querySelector('.zoom-level')?.textContent?.trim()).toBe('125%');
    element.querySelector<HTMLButtonElement>('.fit-button')?.click();
    fixture.detectChanges();
    expect(element.querySelector('.zoom-level')?.textContent?.trim()).toBe('100%');

    const pageInput = element.querySelector<HTMLInputElement>('[aria-label="Page number"]')!;
    pageInput.value = '2';
    pageInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.currentPage).toBe(2);
    await new Promise<void>(resolve => {
      const interval = window.setInterval(() => {
        if (element.querySelector<HTMLCanvasElement>('[data-page-number="2"]')?.dataset['rendered'] === 'true') {
          window.clearInterval(interval);
          resolve();
        }
      }, 10);
    });
    expect(element.querySelector<HTMLCanvasElement>('[data-page-number="2"]')?.dataset['rendered'])
      .toBe('true');
    fixture.destroy();
  });
});
