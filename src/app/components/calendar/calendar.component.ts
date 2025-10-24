import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoogleCalendarService } from '../../services/google-calendar.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Component, OnInit, ViewChild, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events: any[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today downloadCalendar',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    height: '100%',
    customButtons: {
      // 👇 define behavior of the custom button
      downloadCalendar: {
        text: '📥 Download',
        click: this.downloadCalendarEvents.bind(this)
      }
    },
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

 

  constructor(private gCal: GoogleCalendarService, @Inject(PLATFORM_ID) private platformId: Object) { }

  async ngOnInit() {
    try {
      // Initialize the Google API client
      await this.gCal.initClient();
      console.log('✅ Google API initialized.');
      this.loadEvents(); // Load events after initialization
    } catch (err) {
      console.error('❌ GAPI init error:', err);
    }
  }

    ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Set initial view based on screen width
      this.adjustCalendarForScreen(window.innerWidth);

      // Listen to window resize
      window.addEventListener('resize', () => {
        this.adjustCalendarForScreen(window.innerWidth);
      });
    }
  }

   async downloadCalendarEvents() {
    try {
      const events = await this.gCal.listEvents();

      if (!events || events.length === 0) {
        alert('No events found for this month.');
        return;
      }

      const icsContent = this.generateICS(events);
      this.triggerDownload(icsContent);
    } catch (err) {
      console.error('❌ Error fetching or downloading events:', err);
      alert('Failed to download calendar events.');
    }
  }

  private generateICS(events: any[]): string {
    const vevents = events.map(event => `
BEGIN:VEVENT
UID:${Date.now()}-${Math.random().toString(36).substring(2)}@myapp.com
DTSTAMP:${this.formatDate(new Date())}
DTSTART:${this.formatDate(new Date(event.start))}
DTEND:${this.formatDate(new Date(event.end))}
SUMMARY:${this.escapeText(event.title || '')}
DESCRIPTION:${this.escapeText(event.description || '')}
LOCATION:${this.escapeText(event.location || '')}
END:VEVENT
    `).join('\n');

    return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourAppName//EN
${vevents}
END:VCALENDAR
    `.trim();
  }

  private triggerDownload(icsContent: string) {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.ics';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  private formatDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private escapeText(text: string): string {
    return text
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n');
  }

 adjustCalendarForScreen(width: number) {
    if (!this.calendarComponent) return; // Safety check

    const calendarApi = this.calendarComponent.getApi();
    if (!calendarApi) return;

    if (width < 768) {
      // Mobile view
      calendarApi.changeView('listWeek');
      calendarApi.setOption('headerToolbar', { left: 'prev,next', center: 'title', right: 'downloadCalendar' });
    } else {
      // Desktop view
      calendarApi.changeView('dayGridMonth');
      calendarApi.setOption('headerToolbar', {
        left: 'prev,next today downloadCalendar',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      });
    }
  }
 

  // async signIn() {
  //   try {
  //     await this.gCal.signIn();
  //     alert('Signed in successfully!');
  //     await this.loadEvents(); // load events after successful sign-in
  //   } catch (err) {
  //     console.error('❌ Sign-in error:', err);
  //   }
  // }

  async loadEvents() {
    try {
      const calendarEvents = await this.gCal.listEvents();

      // Map raw events into FullCalendar format
      this.events = calendarEvents.map((ev: any) => ({
        title: ev.title,
        start: ev.start,
        end: ev.end,
        extendedProps: {
          description: ev.description,
          location: ev.location,
        },
      }));

      console.log('✅ Loaded dynamic events:', this.events);

      // 🔑 Reassign calendarOptions to trigger Angular change detection
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events,
      };
    } catch (err) {
      console.error('❌ Load events error:', err);
    }
  }

  handleEventClick(clickInfo: any) {
    const { title, extendedProps } = clickInfo.event;
    alert(
      `Event: ${title}\nDescription: ${extendedProps.description || 'N/A'}\nLocation: ${extendedProps.location || 'N/A'}`
    );
    console.log('Event clicked:', clickInfo.event);
  }

  // currentMonth: number = 1; // Start with January (0 = Jan, 1 = Feb, etc.)
  // currentYear: number = 2025; // Only allow 2025
  // daysInMonth: number[] = [];
  // events: { date: string, name: string, description: string }[] = [];

  // constructor() {
  //   this.generateMonth();
  //   this.loadEvents();
  // }

  // // 🔹 Generate days for the selected month
  // generateMonth() {
  //   const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate(); 
  //   this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
  // }

  // // 🔹 Statically define events
  // loadEvents() {
  //   this.events = [      
  //     { date: '2025-01-22', name: 'St. Sharbel Healing Mass', description: 'St. Sharbel Spritual Life Center @ 5pm' },
  //     { date: '2025-01-25', name: 'Monthly Service Project', description: 'Bag Lunches for the Homeless @ 8:30am' },
  //     { date: '2025-01-29', name: 'Monthly Bible Study', description: 'Watch a Section of The Chosen Followed by Spiritual Reflection @ OLOV Hall 7pm' },
  //     { date: '2025-02-01', name: 'MYA Social Event', description: 'Puttshack @ 6pm' },
  //     { date: '2025-02-04', name: 'Maronite Mingle', description: 'Zoom Meeting @ 8pm EST' },
  //     { date: '2025-02-09', name: 'St. Maron Mass', description: 'Our Patron Saint' },
  //     { date: '2025-02-09', name: 'Super Bowl Party', description: 'Trash vs Trash @ 5pm' },
  //     { date: '2025-02-15', name: '17th St. Maron Hafli', description: 'Doors Open @ 5:30pm / Appitizers @ 6pm / Dinner @ 7pm / Dancing @ Anytime' },
  //     { date: '2025-02-22', name: 'Monthly Service Project', description: 'Bag Lunches for the Homeless @ 8:00am' },
  //   ];
  // }

  // // 🔹 Get event by date
  // getEvents(day: number): any[] {
  //   const dateStr = `2025-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  //   return this.events.filter(event => event.date === dateStr);
  // }

  // // 🔹 Move to Previous Month
  // prevMonth() {
  //   if (this.currentMonth > 0) {
  //     this.currentMonth--;
  //   } else {
  //     this.currentMonth = 11; // Wrap around to December
  //   }
  //   this.generateMonth();
  // }

  // // 🔹 Move to Next Month
  // nextMonth() {
  //   if (this.currentMonth < 11) {
  //     this.currentMonth++;
  //   } else {
  //     this.currentMonth = 0; // Wrap around to January
  //   }
  //   this.generateMonth();
  // }
}
