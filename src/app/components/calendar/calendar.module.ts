// calendar.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar.component';
import { RouterModule } from '@angular/router';
import { CalendarRoutingModule } from './calendar-routing.module'; // optional routing for lazy load

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FullCalendarModule,
    CalendarRoutingModule // needed if you want /calendar route
  ]
})
export class CalendarModule {}
