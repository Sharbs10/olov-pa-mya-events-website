import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DailyVideoComponent } from './daily-video.component';

describe('DailyVideoComponent', () => {
  let fixture: ComponentFixture<DailyVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyVideoComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyVideoComponent);
    fixture.detectChanges();
  });

  it('renders every Gospel story with its date, passage, and video information', () => {
    const element = fixture.nativeElement as HTMLElement;
    const cards = element.querySelectorAll<HTMLElement>('.story-card');

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Gospel Stories');
    expect(cards.length).toBe(34);
    expect(element.textContent).toContain('January 4, 2026');
    expect(element.textContent).toContain('Luke 2:41–52');
    expect(element.textContent).toContain('Revelation to Joseph');
  });

  it('keeps additional videos on their story and links each one separately', () => {
    const element = fixture.nativeElement as HTMLElement;
    const story = Array.from(element.querySelectorAll<HTMLElement>('.story-card'))
      .find(card => card.querySelector('h2')?.textContent?.includes('Sheep and the Goats'));
    const links = story?.querySelectorAll<HTMLAnchorElement>('.video-link');

    expect(links?.length).toBe(3);
    expect(Array.from(links ?? [], link => link.textContent?.trim())).toEqual([
      'Gospel story',
      'Pre-K–Grade 1 Sheep and Goats craft',
      'Lego video'
    ]);
  });

  it('links the Faithful Servant video', () => {
    const element = fixture.nativeElement as HTMLElement;
    const story = Array.from(element.querySelectorAll<HTMLElement>('.story-card'))
      .find(card => card.querySelector('h2')?.textContent?.trim() === 'Faithful Servant');

    expect(story?.querySelector<HTMLAnchorElement>('.video-link')?.href)
      .toBe('https://www.youtube.com/watch?v=ArHS0g-3PBA');
  });

  it('announces when video links open in a new tab', () => {
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.video-link');

    expect(links.length).toBe(38);
    expect(Array.from(links).every(link =>
      link.target === '_blank' &&
      link.rel.includes('noopener') &&
      link.getAttribute('aria-label')?.includes('opens in a new tab')
    )).toBeTrue();
  });
});
