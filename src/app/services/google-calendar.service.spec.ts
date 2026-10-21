import { TestBed } from '@angular/core/testing';

import {
  GoogleCalendarService,
  mapGoogleCalendarEvent
} from '../services/google-calendar.service';

describe('GoogleCalendarService', () => {
  let service: GoogleCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('maps the event start date and a Drive image attachment', () => {
    const event = mapGoogleCalendarEvent({
      summary: 'OLOV Day',
      start: { date: '2026-11-15' },
      end: { date: '2026-11-16' },
      attachments: [{
        fileId: '1aMZRhHpqmkHvJwOPD_m9OxO0FT4mIDaJ',
        fileUrl: 'https://drive.google.com/file/d/1aMZRhHpqmkHvJwOPD_m9OxO0FT4mIDaJ/view',
        mimeType: 'image/jpeg'
      }]
    });

    expect(event.start).toBe('2026-11-15');
    expect(event.imageUrl)
      .toBe('https://drive.google.com/thumbnail?id=1aMZRhHpqmkHvJwOPD_m9OxO0FT4mIDaJ&sz=w1200');
  });

  it('ignores non-image attachments', () => {
    const event = mapGoogleCalendarEvent({
      summary: 'Planning meeting',
      start: { dateTime: '2026-11-15T18:00:00-04:00' },
      attachments: [{
        fileId: 'document-id',
        fileUrl: 'https://drive.google.com/file/d/document-id/view',
        mimeType: 'application/pdf'
      }]
    });

    expect(event.start).toBe('2026-11-15T18:00:00-04:00');
    expect(event.imageUrl).toBeUndefined();
  });
});
