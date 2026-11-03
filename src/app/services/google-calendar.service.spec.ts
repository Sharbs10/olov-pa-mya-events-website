import { TestBed } from '@angular/core/testing';

import {
  DEFAULT_CALENDAR_EVENT_IMAGE,
  getCalendarCommunity,
  getCalendarId,
  GoogleCalendarService,
  isEventTodayOrFuture,
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

  it('selects a calendar from the community route', () => {
    expect(getCalendarCommunity('/myo/calendar')).toBe('myo');
    expect(getCalendarCommunity('/mcf/events')).toBe('mcf');
    expect(getCalendarCommunity('/mya/calendar')).toBe('mya');
    expect(getCalendarCommunity('/')).toBe('mya');
  });

  it('uses the configured calendar for each community', () => {
    expect(getCalendarId('mcf'))
      .toBe('a978416274958160f5e3a1048d4af8aaa3ae03e2fea0f4965191256f868f0bc6@group.calendar.google.com');
    expect(getCalendarId('mya'))
      .toBe('2a252d0e94b39661b957cfb51615edce87040ddfd21ba562360d6fac386dad79@group.calendar.google.com');
    expect(getCalendarId('myo'))
      .toBe('a604d4945e47c66671b713bd96fb9ae4ede200dcd41b027b0b76367d286a1c4f@group.calendar.google.com');
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

  it('uses the OLOV placeholder when no image attachment is available', () => {
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
    expect(event.imageUrl).toBe(DEFAULT_CALENDAR_EVENT_IMAGE);
  });

  it('uses the local OLOV photo when the calendar attachment is OLOV.jpg', () => {
    const event = mapGoogleCalendarEvent({
      summary: 'OLOV DAY',
      start: { date: '2026-10-07' },
      attachments: [{
        fileId: 'olov-image-id',
        fileUrl: 'https://drive.google.com/open?id=olov-image-id',
        mimeType: 'image/jpeg',
        title: 'OLOV.jpg'
      }]
    }, 'mya');

    expect(event.imageUrl).toBe('assets/images/OLOV.jpg');
  });

  it('uses the existing Halloween poster for the past MYA Halloween event', () => {
    const event = mapGoogleCalendarEvent({
      summary: 'Halloween',
      start: { date: '2025-10-31' }
    }, 'mya');

    expect(event.imageUrl).toBe('assets/images/MCF_Halloween.jpg');
  });

  it('includes events today and in the future but excludes past events', () => {
    const now = new Date(2026, 10, 15, 12);

    expect(isEventTodayOrFuture('2026-11-14', now)).toBeFalse();
    expect(isEventTodayOrFuture('2026-11-15', now)).toBeTrue();
    expect(isEventTodayOrFuture('2026-11-16T18:00:00-04:00', now)).toBeTrue();
    expect(isEventTodayOrFuture('', now)).toBeFalse();
  });
});
