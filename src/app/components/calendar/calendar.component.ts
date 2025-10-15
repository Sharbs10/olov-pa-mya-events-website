import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  currentMonth: number = 1; // Start with January (0 = Jan, 1 = Feb, etc.)
  currentYear: number = 2025; // Only allow 2025
  daysInMonth: number[] = [];
  events: { date: string, name: string, description: string }[] = [];

  constructor() {
    this.generateMonth();
    this.loadEvents();
  }

  // 🔹 Generate days for the selected month
  generateMonth() {
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate(); 
    this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
  }

  // 🔹 Statically define events
  loadEvents() {
    this.events = [      
      { date: '2025-01-22', name: 'St. Sharbel Healing Mass', description: 'St. Sharbel Spritual Life Center @ 5pm' },
      { date: '2025-01-25', name: 'Monthly Service Project', description: 'Bag Lunches for the Homeless @ 8:30am' },
      { date: '2025-01-29', name: 'Monthly Bible Study', description: 'Watch a Section of The Chosen Followed by Spiritual Reflection @ OLOV Hall 7pm' },
      { date: '2025-02-01', name: 'MYA Social Event', description: 'Puttshack @ 6pm' },
      { date: '2025-02-04', name: 'Maronite Mingle', description: 'Zoom Meeting @ 8pm EST' },
      { date: '2025-02-09', name: 'St. Maron Mass', description: 'Our Patron Saint' },
      { date: '2025-02-09', name: 'Super Bowl Party', description: 'Trash vs Trash @ 5pm' },
      { date: '2025-02-15', name: '17th St. Maron Hafli', description: 'Doors Open @ 5:30pm / Appitizers @ 6pm / Dinner @ 7pm / Dancing @ Anytime' },
      { date: '2025-02-22', name: 'Monthly Service Project', description: 'Bag Lunches for the Homeless @ 8:00am' },
    ];
  }

  // 🔹 Get event by date
  getEvents(day: number): any[] {
    const dateStr = `2025-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return this.events.filter(event => event.date === dateStr);
  }

  // 🔹 Move to Previous Month
  prevMonth() {
    if (this.currentMonth > 0) {
      this.currentMonth--;
    } else {
      this.currentMonth = 11; // Wrap around to December
    }
    this.generateMonth();
  }

  // 🔹 Move to Next Month
  nextMonth() {
    if (this.currentMonth < 11) {
      this.currentMonth++;
    } else {
      this.currentMonth = 0; // Wrap around to January
    }
    this.generateMonth();
  }
}
