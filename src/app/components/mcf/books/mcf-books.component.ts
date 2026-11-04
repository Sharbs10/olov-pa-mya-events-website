import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-mcf-books',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './mcf-books.component.html',
  styleUrl: './mcf-books.component.css'
})
export class McfBooksComponent {
  readonly grades = [
    { number: 1, title: 'GOD IS LOVE' },
    { number: 2, title: 'JESUS' },
    { number: 3, title: 'THE CHURCH' },
    { number: 4, title: 'FOLLOWING JESUS' },
    { number: 5, title: "THE CHURCH'S LITURGY" },
    { number: 6, title: 'THE BIBLE' },
    { number: 7, title: 'OUR MARONITE FAITH' },
    { number: 8, title: 'OUR MARONITE CHURCH HISTORY' }
  ];
}
