import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import {
  CalendarEvent,
  CalendarCommunity,
  getCalendarCommunity,
  isEventTodayOrFuture,
  GoogleCalendarService
} from '../../../services/google-calendar.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

interface CalendarEventDetails {
  title: string;
  start: Date | null;
  end: Date | null;
  allDay: boolean;
  description: string;
  location: string;
  imageUrl: string;
}

interface CalendarWeekDay {
  date: Date;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events: CalendarEvent[] = [];
  calendarOptions!: CalendarOptions;
  isBrowser = false;
  calendarError = '';
  selectedEvent: CalendarEventDetails | null = null;
  mobileWeekDays: CalendarWeekDay[] = [];
  isMobileViewport = false;
  currentViewType = '';
  readonly eventsRoute: string;
  readonly community: CalendarCommunity;
  private readonly handleResize = () => this.adjustCalendarForScreen();

  constructor(
    private readonly gCal: GoogleCalendarService,
    private readonly ngZone: NgZone,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    router: Router
  ) {
    this.community = getCalendarCommunity(router.url);
    this.eventsRoute = `/${this.community}/events`;
  }

  async ngOnInit(): Promise<void> {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;
    this.isMobileViewport = window.matchMedia('(max-width: 620px)').matches;

    try {
      const plugins = await this.loadCalendarPlugins();
      await this.gCal.initClient();
      await this.loadEvents();

      this.calendarOptions = {
        plugins,
        initialView: 'dayGridMonth',
        initialDate: this.getInitialCalendarDate(),
        headerToolbar: this.getHeaderToolbar(),
        height: '100%',
        expandRows: true,
        fixedWeekCount: false,
        dayMaxEvents: true,
        eventColor: '#28639b',
        eventTextColor: '#ffffff',
        customButtons: {
          todayView: {
            text: 'Today',
            click: () => {
              const calendarApi = this.calendarComponent.getApi();
              calendarApi.today();
              calendarApi.changeView('dayGridDay');
            }
          }
        },
        buttonText: {
          dayGridWeek: 'Week',
          listWeek: 'Week',
          dayGridMonth: 'Month'
        },
        events: this.events,
        datesSet: (arg) => this.handleDatesSet(arg),
        eventContent: (eventInfo) => this.renderEventContent(eventInfo),
        eventClick: (eventInfo) => this.handleEventClick(eventInfo)
      };
    } catch (err) {
      this.showCalendarError(err);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    window.addEventListener('resize', this.handleResize);
    this.adjustCalendarForScreen();
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  private async loadCalendarPlugins() {
    const [dayGridPlugin, interactionPlugin, listPlugin] = await Promise.all([
      import('@fullcalendar/daygrid').then(module => module.default),
      import('@fullcalendar/interaction').then(module => module.default),
      import('@fullcalendar/list').then(module => module.default)
    ]);

    return [dayGridPlugin, interactionPlugin, listPlugin];
  }

  private async loadEvents(): Promise<void> {
    const events = await this.gCal.listEvents(this.community, 'all');
    this.events = events;

    if (this.calendarOptions) this.calendarOptions.events = events;
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(events);
    }
  }

  private adjustCalendarForScreen(): void {
    if (!this.isBrowser) return;
    this.isMobileViewport = window.matchMedia('(max-width: 620px)').matches;
    if (!this.calendarComponent) return;

    const calendarApi = this.calendarComponent.getApi();
    const currentView = calendarApi.view.type;
    const weekView = this.getWeekViewForScreen();

    calendarApi.setOption('headerToolbar', this.getHeaderToolbar());
    if (currentView === 'dayGridWeek' || currentView === 'listWeek') {
      if (currentView !== weekView) calendarApi.changeView(weekView);
    }
    calendarApi.updateSize();
  }

  private getHeaderToolbar(): CalendarOptions['headerToolbar'] {
    return {
      left: 'prev,next',
      center: 'title',
      right: `todayView,${this.getWeekViewForScreen()},dayGridMonth`
    };
  }

  private getWeekViewForScreen(): 'listWeek' | 'dayGridWeek' {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 620px)').matches
      ? 'listWeek'
      : 'dayGridWeek';
  }

  get showMobileWeek(): boolean {
    return this.isMobileViewport && this.currentViewType === 'listWeek';
  }

  private handleDatesSet(arg: DatesSetArg): void {
    this.ngZone.run(() => {
      this.currentViewType = arg.view.type;
      if (arg.view.type !== 'listWeek') {
        this.mobileWeekDays = [];
        return;
      }

      this.mobileWeekDays = [];
      const date = new Date(arg.start);
      while (date < arg.end) {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        const events = this.events
          .filter(event => this.eventOverlapsDay(event, dayStart, dayEnd))
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        this.mobileWeekDays.push({ date: dayStart, events });
        date.setDate(date.getDate() + 1);
      }
    });
  }

  private eventOverlapsDay(event: CalendarEvent, dayStart: Date, dayEnd: Date): boolean {
    const start = this.parseEventDate(event.start);
    if (!start) return false;
    const end = this.parseEventDate(event.end);

    return start < dayEnd && (end ? end > dayStart : start >= dayStart);
  }

  private parseEventDate(value: string): Date | null {
    if (!value) return null;
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    const date = dateOnly
      ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
      : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  openWeekEvent(event: CalendarEvent): void {
    this.selectedEvent = {
      title: event.title,
      start: this.parseEventDate(event.start),
      end: this.parseEventDate(event.end),
      allDay: !event.start.includes('T'),
      description: event.description || '',
      location: event.location || '',
      imageUrl: event.imageUrl || ''
    };
  }

  private renderEventContent(eventInfo: EventContentArg): { domNodes: HTMLElement[] } {
    const container = document.createElement('span');
    container.className = 'calendar-event-content';

    const imageUrl = eventInfo.event.extendedProps['imageUrl'];
    if (typeof imageUrl === 'string' && imageUrl) {
      const image = document.createElement('img');
      image.className = 'calendar-event-image';
      image.src = imageUrl;
      image.alt = '';
      image.loading = 'lazy';
      container.appendChild(image);
    }

    const title = document.createElement('span');
    title.className = 'calendar-event-title';
    title.textContent = eventInfo.event.title;
    container.appendChild(title);

    return { domNodes: [container] };
  }

  private getInitialCalendarDate(): string | Date {
    const upcomingEvent = this.events.find((event) => isEventTodayOrFuture(event.start));
    if (upcomingEvent) return upcomingEvent.start;

    const mostRecentPastEvent = [...this.events]
      .reverse()
      .find((event) => event.start && !isEventTodayOrFuture(event.start));
    return mostRecentPastEvent?.start || new Date();
  }

  async downloadCalendarEvents(): Promise<void> {
    if (!this.isBrowser) return;
    try {
      const events = await this.gCal.listEvents(this.community, 'all');
      if (!events.length) return;

      const icsContent = this.generateICS(events);
      this.triggerDownload(icsContent);
    } catch (err) {
      this.showCalendarError(err);
    }
  }

  private showCalendarError(error: unknown): void {
    console.error('Calendar error:', error);
    this.calendarError = error instanceof Error
      ? error.message
      : 'The calendar could not be loaded. Check its ID and sharing settings.';
  }

  private generateICS(events: CalendarEvent[]): string {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MyApp//EN
${events.map(event => `
BEGIN:VEVENT
UID:${Date.now()}-${Math.random().toString(36).substring(2)}@myapp.com
DTSTAMP:${this.formatDate(new Date())}
DTSTART:${this.formatDate(new Date(event.start))}
DTEND:${this.formatDate(new Date(event.end))}
SUMMARY:${this.escapeText(event.title || '')}
DESCRIPTION:${this.escapeText(event.description || '')}
LOCATION:${this.escapeText(event.location || '')}
END:VEVENT`).join('\n')}
END:VCALENDAR`.trim();
  }

  private triggerDownload(icsContent: string): void {
    if (!this.isBrowser) return;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'events.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private escapeText(text: string): string {
    return text.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const event = clickInfo.event;
    this.selectedEvent = {
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      description: typeof event.extendedProps['description'] === 'string'
        ? event.extendedProps['description']
        : '',
      location: typeof event.extendedProps['location'] === 'string'
        ? event.extendedProps['location']
        : '',
      imageUrl: typeof event.extendedProps['imageUrl'] === 'string'
        ? event.extendedProps['imageUrl']
        : ''
    };
  }

  closeEventDetails(): void {
    this.selectedEvent = null;
  }
}
