import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { McfBookChapterComponent } from './mcf-book-chapter.component';

describe('McfBookChapterComponent', () => {
  it('displays the chapter PDF with a download link', async () => {
    await TestBed.configureTestingModule({
      imports: [McfBookChapterComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ chapter: 'ch3' }) } }
        },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(McfBookChapterComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('MCF Books — CH3');
    expect(element.querySelector('iframe')?.getAttribute('title')).toBe('MCF book chapter 3 PDF');
    expect(element.querySelector<HTMLAnchorElement>('.download-button')?.getAttribute('href'))
      .toBe('/assets/mcf/books/ch3.pdf');
  });
});
