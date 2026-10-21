import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface CalendarEvent {
  id?: string;
  recurringEventId?: string;
  title: string;
  start: string;
  end: string;
  description: string;
  location: string;
  imageUrl?: string;
}

interface GoogleCalendarAttachment {
  fileId?: string;
  fileUrl?: string;
  mimeType?: string;
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

export function mapGoogleCalendarEvent(event: GoogleCalendarApiEvent): CalendarEvent {
  const imageAttachment = event.attachments?.find((attachment) =>
    attachment.fileUrl &&
    (attachment.mimeType?.startsWith('image/') ||
      /\.(avif|gif|jpe?g|png|webp)(?:[?#]|$)/i.test(attachment.fileUrl))
  );

  return {
    id: event.id,
    recurringEventId: event.recurringEventId,
    title: event.summary || '',
    start: event.start?.dateTime || event.start?.date || '',
    end: event.end?.dateTime || event.end?.date || '',
    description: event.description || '',
    location: event.location || '',
    imageUrl: imageAttachment ? getImageUrl(imageAttachment) : undefined
  };
}

function getImageUrl(attachment: GoogleCalendarAttachment): string | undefined {
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
  private CALENDAR_ID = environment.calendarId;

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
  async listEvents(): Promise<CalendarEvent[]> {
    if (!isPlatformBrowser(this.platformId)) return [];

    if (!this.initialized) await this.initClient();
    const gapi = (window as any).gapi;
    if (!gapi) return [];

    // Include all past, present, and future events
    const timeMin = new Date('1970-01-01T00:00:00Z').toISOString();
    // Optional: remove timeMax to get all future events
    // const timeMax = new Date('2100-01-01T00:00:00Z').toISOString();

    let allItems: any[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
      const response: any = await gapi.client.calendar.events.list({
        calendarId: this.CALENDAR_ID,
        timeMin,
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 2500, // max allowed by Google Calendar API
        pageToken: nextPageToken,
      });

      const items = response.result.items || [];
      allItems = allItems.concat(items);

      nextPageToken = response.result.nextPageToken;
    } while (nextPageToken);

    console.log(`🟢 Loaded ${allItems.length} events:`, allItems);

    return allItems.map((event: GoogleCalendarApiEvent) => mapGoogleCalendarEvent(event));
  }

}
