import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EventsComponent } from './components/events/events.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { BoardComponent } from './components/board/board.component';
import { PrivatePolicyComponent } from './components/private-policy/private-policy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'events', component: EventsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'board', component: BoardComponent },
  { path: 'privacy-policy', component: PrivatePolicyComponent }
];