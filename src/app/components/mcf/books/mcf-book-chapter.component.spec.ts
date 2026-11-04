import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { McfBookChapterComponent } from './mcf-book-chapter.component';

describe('McfBookChapterComponent', () => {
  it('loads the chapter PDF for viewing and provides a download link', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(
      new Response(new Blob(['%PDF'], { type: 'application/pdf' }), { status: 200 })
    ));
    spyOn(URL, 'createObjectURL').and.returnValue('blob:chapter-pdf');

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
    await fixture.whenStable();
    await new Promise(resolve => window.setTimeout(resolve, 0));
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('MCF Books — CH3');
    expect(element.querySelector('iframe')?.getAttribute('title')).toBe('MCF book chapter 3 PDF');
    expect(element.querySelector('iframe')?.getAttribute('src')).toBe('blob:chapter-pdf');
    expect(element.querySelector<HTMLAnchorElement>('.download-button')?.getAttribute('href'))
      .toBe('https://raw.githubusercontent.com/Sharbs10/olov-pa-mya-events-website/SharbsDev/public/assets/mcf/books/ch3.pdf');
    fixture.destroy();
  });
});
