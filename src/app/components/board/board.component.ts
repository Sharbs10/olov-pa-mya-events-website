import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  members = [
    { name: 'Tamara Alchoufete', photo: 'assets/images/tamara.jpg' },
    { name: 'Chloé Bassil', photo: 'assets/images/chloe.jpg' },
    { name: 'Jason Taylor', photo: 'assets/images/jason.jpg' },
    { name: 'Sharbel Sadaka', photo: 'assets/images/sharbel.jpg' }
  ];

}
