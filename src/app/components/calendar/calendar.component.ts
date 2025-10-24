import { Component, Inject, PLATFORM_ID, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { GoogleCalendarService } from '../../services/google-calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events: any[] = [];
  calendarOptions!: CalendarOptions;
  isBrowser = false;

  constructor(
    private gCal: GoogleCalendarService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
  this.isBrowser = isPlatformBrowser(this.platformId);

  if (this.isBrowser) {
    try {
      // 1️⃣ Lazy-load FullCalendar plugins first
      const plugins = await this.loadCalendarPlugins();

      // 2️⃣ Initialize calendarOptions after plugins are ready
      this.calendarOptions = {
        plugins,
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today downloadCalendar',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        height: '100%',
        customButtons: {
          downloadCalendar: {
            text: '📥 Download',
            click: () => this.downloadCalendarEvents()
          }
        },
        events: this.events,
  eventClick: this.handleEventClick.bind(this)
      };

      // 3️⃣ Initialize GAPI client and load events
      await this.gCal.initClient();
      await this.loadEvents();
    } catch (err) {
      console.error('Calendar init error:', err);
    }
  }
}

  async ngAfterViewInit() {
    if (!this.isBrowser) return;

    setTimeout(() => {
      this.adjustCalendarForScreen(window.innerWidth);
      window.addEventListener('resize', () =>
        this.adjustCalendarForScreen(window.innerWidth)
      );
    });
  }

  private async loadCalendarPlugins() {
    // Lazy load the FullCalendar plugins dynamically in browser
    const [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin] = await Promise.all([
      import('@fullcalendar/daygrid').then(m => m.default),
      import('@fullcalendar/timegrid').then(m => m.default),
      import('@fullcalendar/interaction').then(m => m.default),
      import('@fullcalendar/list').then(m => m.default),
    ]);

    return [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin];
  }

  private async loadEvents() {
    if (!this.isBrowser) return;
    const events = await this.gCal.listEvents();
    this.events = events;
    this.calendarOptions.events = events;
  }

  private adjustCalendarForScreen(width: number) {
    if (!this.isBrowser || !this.calendarComponent) return;

    const calendarApi = this.calendarComponent.getApi();
    if (!calendarApi) return;

    if (width < 768) {
      calendarApi.changeView('listWeek');
      calendarApi.setOption('headerToolbar', {
        left: 'prev,next',
        center: 'title',
        right: 'downloadCalendar'
      });
    } else {
      calendarApi.changeView('dayGridMonth');
      calendarApi.setOption('headerToolbar', {
        left: 'prev,next today downloadCalendar',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      });
    }
  }

  private async downloadCalendarEvents() {
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

  private triggerDownload(icsContent: string) {
    if (!this.isBrowser) return;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private formatDate(date: Date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private escapeText(text: string) {
    return text.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
  }

  handleEventClick(clickInfo: any) {
  const event = clickInfo.event;

  // Example: use alert (for testing)
  alert(
    `Event: ${event.title}\n` +
    `Start: ${event.start?.toLocaleString()}\n` +
    `End: ${event.end?.toLocaleString()}\n` +
    `Description: ${event.extendedProps.description || ''}\n` +
    `Location: ${event.extendedProps.location || ''}`
  );

  // If you want a modal, open your Angular modal here instead of alert
}
}
