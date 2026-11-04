import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

import { ResourcesComponent } from './resources.component';

describe('ResourcesComponent', () => {
  let fixture: ComponentFixture<ResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesComponent);
  });

  it('shows Gospel Stories, Quizlet, and MCF Books on the MCF resources page', () => {
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/mcf/resources');
    fixture.detectChanges();

    const links = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.resource-links a');

    expect(Array.from(links, link => ({
      title: link.querySelector('strong')?.textContent?.trim(),
      description: link.querySelector('.resource-copy > span')?.textContent?.trim()
    }))).toEqual([
      { title: 'Gospel Stories', description: 'Explore Bible stories, verses, videos, and activities.' },
      { title: 'Quizlet', description: 'Review and practice what you learn.' },
      { title: 'MCF Books', description: 'Read and download book chapters.' }
    ]);
    expect(Array.from(links, link => link.getAttribute('href'))).toEqual([
      '/mcf/gospel-stories',
      '/mcf/quizlet',
      '/mcf/books'
    ]);
  });

  it('keeps the existing placeholder on non-MCF resources pages', () => {
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/mya/resources');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Resources');
    expect(element.querySelector('.resource-links')).toBeNull();
  });
});
