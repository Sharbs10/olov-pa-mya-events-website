import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { QuizletComponent } from './quizlet.component';

describe('QuizletComponent', () => {
  let fixture: ComponentFixture<QuizletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizletComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizletComponent);
    fixture.detectChanges();
  });

  it('shows all eight MCF grades in the same order and with the same titles as the books page', () => {
    const gradeCards = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.grade-grid > *')
    );

    expect(gradeCards.map(card => [
      card.querySelector('.grade-number')?.textContent?.trim(),
      card.querySelector('.grade-title')?.textContent?.trim()
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

  it('links Grade 6 to the Bible Quizlet folder and labels other grades as coming soon', () => {
    const element = fixture.nativeElement as HTMLElement;
    const grade6 = element.querySelector<HTMLAnchorElement>('.grade-color-6');

    expect(grade6?.href).toBe('https://quizlet.com/user/Sharbel_Sadaka/folders/the-bible');
    expect(grade6?.target).toBe('_blank');
    expect(grade6?.rel).toContain('noopener');
    expect(grade6?.getAttribute('aria-label')).toContain('opens Quizlet in a new tab');
    expect(element.querySelectorAll('.grade-grid > div').length).toBe(7);
    expect(element.querySelector('.grade-color-1')?.textContent).toContain('Coming soon');
  });

  it('uses the same rainbow colors as the MCF Books grade buttons', () => {
    const expectedColors = [
      'rgb(179, 38, 50)',
      'rgb(242, 123, 33)',
      'rgb(209, 168, 0)',
      'rgb(55, 148, 71)',
      'rgb(22, 138, 173)',
      'rgb(53, 100, 200)',
      'rgb(103, 65, 165)',
      'rgb(191, 63, 131)'
    ];
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.grade-grid > *');

    expect(Array.from(cards, card => getComputedStyle(card).backgroundColor)).toEqual(expectedColors);
  });
});
