import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export type CalendarCommunity = 'mcf' | 'mya' | 'myo';
export type CalendarEventRange = 'all' | 'upcoming';
export const DEFAULT_CALENDAR_EVENT_IMAGE = 'assets/images/OLOV.jpg';
const MYA_HALLOWEEN_EVENT_IMAGE = 'assets/images/MCF_Halloween.jpg';

export function getCalendarCommunity(route: string): CalendarCommunity {
  const community = route.split('/').filter(Boolean)[0];
  return community === 'mcf' || community === 'myo' || community === 'mya'
    ? community
    : 'mya';
}

export function getCalendarId(community: CalendarCommunity): string {
  const calendarId = environment.calendarIds[community].trim();
  if (!calendarId) {
    throw new Error(
      `No Google Calendar ID is configured for ${community.toUpperCase()}. ` +
      `Add it to calendarIds.${community} in the environment configuration.`
    );
  }
  return calendarId;
}

export function isEventTodayOrFuture(start: string, now = new Date()): boolean {
  if (!start) {
    return false;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(start);
  if (dateOnly) {
    const todayDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');
    return start >= todayDate;
  }

  const eventDate = new Date(start);
  if (Number.isNaN(eventDate.getTime())) {
    return false;
  }
  eventDate.setHours(0, 0, 0, 0);
  return eventDate.getTime() >= today.getTime();
}

export interface CalendarEvent {
  id?: string;
  recurringEventId?: string;
  title: string;
  start: string;
  end: string;
  description: string;
  location: string;
  imageUrl: string;
}

interface GoogleCalendarAttachment {
  fileId?: string;
  fileUrl?: string;
  mimeType?: string;
  title?: string;
}

interface GoogleCalendarApiEvent {
  id?: string;
  recurringEventId?: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  description?: string;
  location?: string;
  attachments?: GoogleCalendarAttachment[];
}

export function mapGoogleCalendarEvent(
  event: GoogleCalendarApiEvent,
  community?: CalendarCommunity
): CalendarEvent {
  const imageAttachment = event.attachments?.find((attachment) =>
    attachment.fileUrl &&
    (attachment.mimeType?.startsWith('image/') ||
      /\.(avif|gif|jpe?g|png|webp)(?:[?#]|$)/i.test(attachment.fileUrl))
  );
  const start = event.start?.dateTime || event.start?.date || '';
  const isMyaHalloweenEvent = community === 'mya' &&
    event.summary?.trim().toLowerCase() === 'halloween' &&
    start.startsWith('2025-10-31');

  return {
    id: event.id,
    recurringEventId: event.recurringEventId,
    title: event.summary || 'Untitled event',
    start,
    end: event.end?.dateTime || event.end?.date || '',
    description: event.description || '',
    location: event.location || '',
    imageUrl: imageAttachment
      ? getImageUrl(imageAttachment) || DEFAULT_CALENDAR_EVENT_IMAGE
      : isMyaHalloweenEvent
        ? MYA_HALLOWEEN_EVENT_IMAGE
        : DEFAULT_CALENDAR_EVENT_IMAGE
  };
}

function getImageUrl(attachment: GoogleCalendarAttachment): string | undefined {
  if (attachment.title?.toLowerCase() === 'olov.jpg') {
    return 'assets/images/OLOV.jpg';
  }

  if (!attachment.fileUrl) {
    return undefined;
  }

  if (attachment.fileId) {
    const imageUrl = new URL('https://drive.google.com/thumbnail');
    imageUrl.searchParams.set('id', attachment.fileId);
    imageUrl.searchParams.set('sz', 'w1200');
    return imageUrl.toString();
  }

  return attachment.fileUrl;
}

@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  private API_KEY = environment.firebase.apiKey;
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  private initialized = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // Load GAPI script only in browser
  private async loadGapi(): Promise<any> {
    if (!isPlatformBrowser(this.platformId)) return null;

    return new Promise<any>((resolve, reject) => {
      if ((window as any).gapi) return resolve((window as any).gapi);

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve((window as any).gapi);
      script.onerror = () => reject('GAPI script failed to load');
      document.body.appendChild(script);
    });
  }

  // Initialize GAPI client
  async initClient(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.initialized) return;

    const gapi = await this.loadGapi();
    if (!gapi) return;

    return new Promise<void>((resolve, reject) => {
      gapi.load('client', async () => {
        try {
          await gapi.client.init({
            apiKey: this.API_KEY,
            discoveryDocs: this.DISCOVERY_DOCS,
          });
          this.initialized = true;
          console.log('🟢 GAPI client initialized');
          resolve();
        } catch (err) {
          console.error('❌ GAPI init failed lol:', err);
          reject(err);
        }
      });
    });
  }

  // List events
  async listEvents(
    community: CalendarCommunity = 'mya',
    range: CalendarEventRange = 'upcoming'
  ): Promise<CalendarEvent[]> {
    if (!isPlatformBrowser(this.platformId)) return [];

    const calendarId = getCalendarId(community);
    if (!this.initialized) await this.initClient();
    const gapi = (window as any).gapi;
    if (!gapi) return [];

    const request: Record<string, unknown> = {
      calendarId,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 2500,
    };
    if (range === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      request['timeMin'] = today.toISOString();
    }

    let allItems: GoogleCalendarApiEvent[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
      const response: any = await gapi.client.calendar.events.list({
        ...request,
        pageToken: nextPageToken,
      });

      const items: GoogleCalendarApiEvent[] = response.result.items || [];
      allItems = allItems.concat(items);

      nextPageToken = response.result.nextPageToken;
    } while (nextPageToken);

    const events = allItems.map((event) => mapGoogleCalendarEvent(event, community));
    return range === 'all'
      ? events
      : events.filter((event) => isEventTodayOrFuture(event.start));
  }

}
