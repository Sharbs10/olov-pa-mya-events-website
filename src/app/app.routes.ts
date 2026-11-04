import { Routes } from '@angular/router';
import { OlovHubComponent } from './components/olov-hub/olov-hub.component';
import { McfComponent } from './components/mcf/mcf.component';
import { MyoComponent } from './components/myo/myo.component';
import { MyaComponent } from './components/mya/mya.component';
import { AboutUsComponent } from './components/shared/about-us/about-us.component';
import { EventsComponent } from './components/shared/events/events.component';
import { CalendarComponent } from './components/shared/calendar/calendar.component';
import { ResourcesComponent } from './components/shared/resources/resources.component';
import { DailyVideoComponent } from './components/mcf/daily-video/daily-video.component';
import { QuizletComponent } from './components/mcf/quizlet/quizlet.component';
import { McfBooksComponent } from './components/mcf/books/mcf-books.component';
import { McfBookChapterComponent } from './components/mcf/books/mcf-book-chapter.component';
import { SpiritualComponent } from './components/mya/spiritual/spiritual.component';
import { ServiceComponent } from './components/mya/service/service.component';
import { SocialComponent } from './components/mya/social/social.component';
import { DevAccessComponent } from './components/dev/dev-access/dev-access.component';
import { devAccessGuard } from './services/dev-access.guard';

export const routes: Routes = [
  { path: 'dev', component: DevAccessComponent },
  {
    path: 'dev/pdf',
    canActivate: [devAccessGuard],
    loadComponent: () => import('./components/dev/pdf-merge/pdf-merge.component')
      .then(component => component.PdfMergeComponent)
  },
  { path: '', component: OlovHubComponent },
  { path: 'mcf', component: McfComponent },
  { path: 'mcf/about-us', component: AboutUsComponent },
  { path: 'mcf/daily-video', component: DailyVideoComponent },
  { path: 'mcf/quizlet', component: QuizletComponent },
  { path: 'mcf/books', component: McfBooksComponent },
  { path: 'mcf/books/:chapter', component: McfBookChapterComponent },
  { path: 'mcf/events', component: EventsComponent },
  { path: 'mcf/calendar', component: CalendarComponent },
  { path: 'mcf/resources', component: ResourcesComponent },
  { path: 'myo', component: MyoComponent },
  { path: 'myo/about-us', component: AboutUsComponent },
  { path: 'myo/events', component: EventsComponent },
  { path: 'myo/calendar', component: CalendarComponent },
  { path: 'myo/resources', component: ResourcesComponent },
  { path: 'mya', component: MyaComponent },
  { path: 'mya/spiritual', component: SpiritualComponent },
  { path: 'mya/service', component: ServiceComponent },
  { path: 'mya/social', component: SocialComponent },
  { path: 'mya/about-us', component: AboutUsComponent },
  { path: 'mya/events', component: EventsComponent },
  { path: 'mya/calendar', component: CalendarComponent },
  { path: 'mya/resources', component: ResourcesComponent },
  { path: 'home', redirectTo: 'mya', pathMatch: 'full' },
  { path: 'about-us', redirectTo: 'mya/about-us', pathMatch: 'full' },
  { path: 'events', redirectTo: 'mya/events', pathMatch: 'full' },
  { path: 'calendar', redirectTo: 'mya/calendar', pathMatch: 'full' },
];
