import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare const gapi: any;

@Injectable({ providedIn: 'root' })
export class GapiService {
  private apiLoaded = false;

  async loadClient() {
    if (this.apiLoaded) return;

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client', async () => {
          try {
            await gapi.client.init({
              apiKey: environment.firebase.apiKey, // API key only
              discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
              ]
            });
            this.apiLoaded = true;
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      };
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });
  }

  async listCalendarEvents(calendarId: string, maxResults = 20) {
    await this.loadClient();

    const now = new Date().toISOString();
    const resp = await gapi.client.calendar.events.list({
      calendarId,
      showDeleted: false,
      singleEvents: true,
      maxResults,
      orderBy: 'startTime'
    });

    return resp.result.items || [];
  }
}
