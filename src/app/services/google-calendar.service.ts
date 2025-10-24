import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare const gapi: any;

@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  private API_KEY = environment.firebase.apiKey;
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  private initialized = false;

  // Public calendar ID
  private CALENDAR_ID = environment.calendarId;

  // ✅ Step 1: Dynamically load GAPI
  private loadGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).gapi) return resolve(); // already loaded

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject('GAPI script failed to load');
      document.body.appendChild(script);
    });
  }

  // ✅ Step 2: Initialize GAPI client
  async initClient(): Promise<void> {
    if (this.initialized) return;

    await this.loadGapi();

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

  // ✅ Step 3: Fetch public calendar events (no OAuth needed)
  async listEvents(): Promise<any[]> {
    if (!this.initialized) await this.initClient();

    const now = new Date();
    const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString(); // start of month
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(); // start of next month

    console.log('📅 Fetching events between:', timeMin, '→', timeMax);

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
