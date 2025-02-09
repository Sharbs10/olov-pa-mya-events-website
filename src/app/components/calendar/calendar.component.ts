import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, RouterModule, ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  year: number = 2025; // Static year 2025
  month: number = new Date().getMonth(); // Current month
  daysInMonth: number[] = [];
  eventDetails: { [key: string]: string } = {}; // To store events for each day
  eventForm: FormGroup;
  selectedDate: string | null = null;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      eventTitle: ['']
    });
    this.updateDaysInMonth();
  }

  updateDaysInMonth() {
    const firstDayOfMonth = new Date(this.year, this.month, 1);
    const lastDayOfMonth = new Date(this.year, this.month + 1, 0);
    const totalDays = lastDayOfMonth.getDate();
    this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
  }

  goToPreviousMonth() {
    if (this.month === 0) {
      this.year--;
      this.month = 11;
    } else {
      this.month--;
    }
    this.updateDaysInMonth();
  }

  goToNextMonth() {
    if (this.month === 11) {
      this.year++;
      this.month = 0;
    } else {
      this.month++;
    }
    this.updateDaysInMonth();
  }

  onDayClick(day: number) {
    this.selectedDate = `${this.year}-${this.month + 1}-${day}`;
    const event = this.eventDetails[this.selectedDate] || '';
    this.eventForm.patchValue({ eventTitle: event });
  }

  saveEvent() {
    if (this.selectedDate) {
      this.eventDetails[this.selectedDate] = this.eventForm.value.eventTitle;
    }
  }
}
