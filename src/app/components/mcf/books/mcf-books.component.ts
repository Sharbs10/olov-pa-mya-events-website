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
  readonly chapters = Array.from({ length: 8 }, (_, index) => index + 1);
}
