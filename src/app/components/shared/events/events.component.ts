import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import {
  CalendarEvent,
  CalendarCommunity,
  getCalendarCommunity,
  GoogleCalendarService
} from '../../../services/google-calendar.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit, OnDestroy {


  currentIndex = 0;
  slideshowIntervalId: ReturnType<typeof setInterval> | null = null;
  calendarEvents: CalendarEvent[] = [];
  eventsError = '';
  readonly calendarRoute: string;
  readonly community: CalendarCommunity;

  constructor(
    private readonly googleCalendar: GoogleCalendarService,
    router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.community = getCalendarCommunity(router.url);
    this.calendarRoute = `/${this.community}/calendar`;
  }

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.calendarEvents = await this.googleCalendar.listEvents(this.community, 'upcoming');
        this.startSlideshow();
      } catch (error) {
        console.error('Could not load calendar events:', error);
        this.eventsError = 'Calendar events could not be loaded. Please try again later.';
      }
    }
  }

  pauseSlideshow(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.slideshowIntervalId) {
      clearInterval(this.slideshowIntervalId);
      this.slideshowIntervalId = null;
    }
  }

  resumeSlideshow(): void {
    if (isPlatformBrowser(this.platformId) && !this.slideshowIntervalId) {
      this.startSlideshow();
    }
  }

  showPreviousEvent(): void {
    if (this.calendarEvents.length < 2) return;
    this.currentIndex = (this.currentIndex - 1 + this.calendarEvents.length) % this.calendarEvents.length;
  }

  showNextEvent(): void {
    if (this.calendarEvents.length < 2) return;
    this.currentIndex = (this.currentIndex + 1) % this.calendarEvents.length;
  }

  startSlideshow(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.slideshowIntervalId && this.calendarEvents.length > 1) {
      this.slideshowIntervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.calendarEvents.length;
      }, 8000);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.pauseSlideshow();
    }
  }
}
