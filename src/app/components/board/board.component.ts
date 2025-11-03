import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

  constructor(private router: Router) {}
  
  members = [
    { name: 'Tamara Alchoufete', photo: 'assets/images/hehe.gif' },
    { name: 'Chloé Bassil', photo: 'assets/images/chloe.jpg' },
    { name: 'Jason Taylor', photo: 'assets/images/jason.jpg' },
    { name: 'Sharbel Sadaka', photo: 'assets/images/sharbel.jpg' }
  ];

}
