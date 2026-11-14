import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { McBibleWorldComponent } from './mc-bible-world.component';

describe('McBibleWorldComponent', () => {
  let fixture: ComponentFixture<McBibleWorldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McBibleWorldComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(McBibleWorldComponent);
    fixture.detectChanges();
  });

  it('shows the requested Realm information sections', () => {
    const headings = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('h2'),
      heading => heading.textContent?.trim().replace(/\s+/g, ' ')
    );

    expect(headings).toEqual([
      'What this is',
      'How to join',
      'Expectations',
      'Specs to be able to join',
      'Disclaimer'
    ]);
  });

  it('reveals the Realm invite only when the correct password is entered', () => {
    const component = fixture.componentInstance;
    component.password = 'wrong';
    component.unlockRealmLink();
    fixture.detectChanges();

    expect(component.isRealmLinkRevealed).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('That password is not correct');

    component.password = 'MCBible2026';
    component.unlockRealmLink();
    fixture.detectChanges();

    expect(component.isRealmLinkRevealed).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('https://realms.gg/bFR7ZyGfVDVgQqs');
  });

  it('shows each console as a native accordion', () => {
    const summaries = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.console-accordion summary'),
      summary => summary.textContent?.trim()
    );

    expect(summaries).toEqual([
      'Nintendo Switch',
      'PlayStation 4 and PlayStation 5',
      'Xbox One and Xbox Series X|S'
    ]);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.console-accordion:not([open])').length).toBe(3);
  });
});
