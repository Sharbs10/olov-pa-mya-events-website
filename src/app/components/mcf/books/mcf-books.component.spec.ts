import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { McfBooksComponent } from './mcf-books.component';

describe('McfBooksComponent', () => {
  it('shows eight grade books in order', async () => {
    await TestBed.configureTestingModule({
      imports: [McfBooksComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(McfBooksComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('.chapter-grid a'));
    expect(links.length).toBe(8);
    expect(links.map(link => [
      link.querySelector('.chapter-number')?.textContent?.trim(),
      link.querySelector('.grade-title')?.textContent?.trim()
    ])).toEqual([
      ['Grade 1', 'GOD IS LOVE'],
      ['Grade 2', 'JESUS'],
      ['Grade 3', 'THE CHURCH'],
      ['Grade 4', 'FOLLOWING JESUS'],
      ['Grade 5', "THE CHURCH'S LITURGY"],
      ['Grade 6', 'THE BIBLE'],
      ['Grade 7', 'OUR MARONITE FAITH'],
      ['Grade 8', 'OUR MARONITE CHURCH HISTORY']
    ]);
  });
});
