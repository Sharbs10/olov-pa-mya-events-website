import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CalendarEvent, GoogleCalendarService } from '../../../services/google-calendar.service';

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
  imageEvents: CalendarEvent[] = [];
  eventsError = '';
  readonly calendarRoute: string;

  constructor(
    private readonly googleCalendar: GoogleCalendarService,
    router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    const community = router.url.split('/').filter(Boolean)[0] || 'mya';
    this.calendarRoute = `/${community}/calendar`;
  }

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const events = await this.googleCalendar.listEvents();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingImageEvents = events
          .filter((event) =>
            Boolean(event.imageUrl) &&
            Boolean(event.start) &&
            new Date(event.start).getTime() >= today.getTime()
          )
          .sort((first, second) => new Date(first.start).getTime() - new Date(second.start).getTime());
        const eventSeries = new Map<string, CalendarEvent>();

        upcomingImageEvents.forEach((event) => {
          const key = event.recurringEventId || event.id || `${event.title}-${event.start}`;
          if (!eventSeries.has(key)) {
            eventSeries.set(key, event);
          }
        });

        this.imageEvents = [...eventSeries.values()];
        this.startSlideshow();
      } catch (error) {
        console.error('Could not load event images:', error);
        this.eventsError = 'Event images could not be loaded. Please try again later.';
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
    if (this.imageEvents.length < 2) return;
    this.currentIndex = (this.currentIndex - 1 + this.imageEvents.length) % this.imageEvents.length;
  }

  showNextEvent(): void {
    if (this.imageEvents.length < 2) return;
    this.currentIndex = (this.currentIndex + 1) % this.imageEvents.length;
  }

  startSlideshow(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.slideshowIntervalId && this.imageEvents.length > 1) {
      this.slideshowIntervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.imageEvents.length;
      }, 8000);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.pauseSlideshow();
    }
  }
}
