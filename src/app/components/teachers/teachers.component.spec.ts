import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TeachersComponent } from './teachers.component';

describe('TeachersComponent', () => {
  let component: TeachersComponent;
  let fixture: ComponentFixture<TeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachersComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('accepts each teacher name regardless of case or surrounding whitespace', () => {
    for (const name of ['Dima', 'Maria', 'Mia', 'Marie-Belle', 'Sharbel', 'Tony', 'Hoda', 'Chloe', 'Christelle']) {
      component.teacherName = `  ${name.toUpperCase()}  `;
      component.submitName();
      expect(component.isAuthenticated).withContext(name).toBeTrue();
      component.lockResources();
    }
  });

  it('rejects names that are not on the teacher list', () => {
    component.teacherName = 'Alex';
    component.submitName();
    fixture.detectChanges();

    expect(component.isAuthenticated).toBeFalse();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('not recognized');
  });

  it('shows the provided downloads and link after access is granted', () => {
    component.teacherName = 'Dima';
    component.submitName();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const downloads = element.querySelectorAll<HTMLAnchorElement>('[download]');
    const hrefs = Array.from(downloads, link => link.getAttribute('href'));

    expect(hrefs.length).toBe(10);
    expect(hrefs).toContain('/assets/teachers/eparchial-desk-calendar-2026.pdf');
    expect(hrefs).toContain('/assets/teachers/mcf-teachers-directory.xlsx');
    expect(element.querySelector('a[href^="https://drive.google.com"]')?.textContent).toContain('Dabke Videos');
  });

  it('locks the resources again when requested', () => {
    component.teacherName = 'Maria';
    component.submitName();
    component.lockResources();
    fixture.detectChanges();

    expect(component.isAuthenticated).toBeFalse();
    expect((fixture.nativeElement as HTMLElement).querySelector('#teacher-name')).not.toBeNull();
  });
});
