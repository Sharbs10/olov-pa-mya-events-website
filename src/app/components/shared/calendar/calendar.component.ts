import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { GoogleCalendarService } from '../../../services/google-calendar.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

interface CalendarEventDetails {
  title: string;
  start: Date | null;
  end: Date | null;
  description: string;
  location: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, HeaderComponent, FooterComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events: any[] = [];
  calendarOptions!: CalendarOptions;
  isBrowser = false;
  selectedEvent: CalendarEventDetails | null = null;
  private readonly handleResize = () => this.adjustCalendarForScreen();

  constructor(
    private readonly gCal: GoogleCalendarService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  async ngOnInit(): Promise<void> {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    try {
      const plugins = await this.loadCalendarPlugins();
      this.calendarOptions = {
        plugins,
        initialView: 'dayGridMonth',
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
          dayGridMonth: 'Month'
        },
        events: this.events,
        eventClick: (eventInfo) => this.handleEventClick(eventInfo)
      };

      await this.gCal.initClient();
      await this.loadEvents();
    } catch (err) {
      console.error('Calendar init error:', err);
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
    const [dayGridPlugin, interactionPlugin] = await Promise.all([
      import('@fullcalendar/daygrid').then(module => module.default),
      import('@fullcalendar/interaction').then(module => module.default)
    ]);

    return [dayGridPlugin, interactionPlugin];
  }

  private async loadEvents(): Promise<void> {
    const events = await this.gCal.listEvents();
    this.events = events;

    if (this.calendarOptions) this.calendarOptions.events = events;
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(events);
    }
  }

  private adjustCalendarForScreen(): void {
    if (!this.isBrowser || !this.calendarComponent) return;

    const calendarApi = this.calendarComponent.getApi();
    calendarApi.setOption('headerToolbar', this.getHeaderToolbar());
    calendarApi.updateSize();
  }

  private getHeaderToolbar(): CalendarOptions['headerToolbar'] {
    return {
      left: 'prev,next',
      center: 'title',
      right: 'todayView,dayGridWeek,dayGridMonth'
    };
  }

  async downloadCalendarEvents(): Promise<void> {
    if (!this.isBrowser) return;
    const events = await this.gCal.listEvents();
    if (!events || events.length === 0) return;

    const icsContent = this.generateICS(events);
    this.triggerDownload(icsContent);
  }

  private generateICS(events: any[]): string {
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
      description: typeof event.extendedProps['description'] === 'string'
        ? event.extendedProps['description']
        : '',
      location: typeof event.extendedProps['location'] === 'string'
        ? event.extendedProps['location']
        : ''
    };
  }

  closeEventDetails(): void {
    this.selectedEvent = null;
  }
}
