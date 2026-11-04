import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { McfBooksComponent } from './mcf-books.component';

describe('McfBooksComponent', () => {
  it('shows eight chapter links in order', async () => {
    await TestBed.configureTestingModule({
      imports: [McfBooksComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(McfBooksComponent);
    fixture.detectChanges();

    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.chapter-grid a')
    );
    expect(links.length).toBe(8);
    expect(links.map(link => link.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'CH1', 'CH2', 'CH3', 'CH4', 'CH5', 'CH6', 'CH7', 'CH8'
    ]);
  });
});
