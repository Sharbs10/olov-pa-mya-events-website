import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  private API_KEY = environment.firebase.apiKey;
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  private initialized = false;
  private CALENDAR_ID = environment.calendarId;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
          console.error('❌ GAPI init failed:', err);
          reject(err);
        }
      });
    });
  }

  // List events
  async listEvents(): Promise<any[]> {
    if (!isPlatformBrowser(this.platformId)) return [];

    if (!this.initialized) await this.initClient();
    const gapi = (window as any).gapi;
    if (!gapi) return [];

    const now = new Date();
    const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    const response = await gapi.client.calendar.events.list({
      calendarId: this.CALENDAR_ID,
      timeMin,
      timeMax,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50,
    });

    const items = response.result.items || [];
    console.log(`🟢 Loaded ${items.length} events:`, items);
    return items.map((event: any) => ({
      title: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      description: event.description || '',
      location: event.location || '',
    }));
  }
}
