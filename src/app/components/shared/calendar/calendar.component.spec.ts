import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CalendarComponent } from './calendar.component';
import { CalendarEvent } from '../../../services/google-calendar.service';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows seven mobile week rows with events beside their dates', () => {
    const event: CalendarEvent = {
      id: 'sunday-event',
      title: 'Sunday gathering',
      start: '2026-11-01T10:00:00',
      end: '2026-11-01T11:00:00',
      description: '',
      location: 'Church hall',
      imageUrl: ''
    };
    component.isMobileViewport = true;
    component.currentViewType = 'listWeek';
    component.mobileWeekDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(2026, 10, 1 + index);
      return { date, events: index === 0 ? [event] : [] };
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const rows = element.querySelectorAll<HTMLElement>('.mobile-week-row');
    const firstRow = rows[0];

    expect(rows.length).toBe(7);
    expect(firstRow.querySelector('.mobile-week-date')?.textContent?.trim()).toBe('SUN11/1');
    expect(firstRow.querySelector('.mobile-week-event')?.textContent).toContain('Sunday gathering');
    expect(firstRow.querySelector('.mobile-week-event')?.textContent).toContain('Church hall');
    expect(rows[1].querySelector('.mobile-week-event')).toBeNull();
  });

  it('opens event details from a mobile week event button', () => {
    const event: CalendarEvent = {
      title: 'Sunday gathering',
      start: '2026-11-01',
      end: '2026-11-02',
      description: 'Community lunch',
      location: 'Church hall',
      imageUrl: ''
    };
    component.openWeekEvent(event);

    expect(component.selectedEvent?.title).toBe('Sunday gathering');
    expect(component.selectedEvent?.allDay).toBeTrue();
    expect(component.selectedEvent?.description).toBe('Community lunch');
  });
});
