import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EventsComponent } from './components/events/events.component';
import { BoardComponent } from './components/board/board.component';
import { PrivatePolicyComponent } from './components/private-policy/private-policy.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'events', component: EventsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'board', component: BoardComponent },
  { path: 'about-us', component: AboutUsComponent },
];
