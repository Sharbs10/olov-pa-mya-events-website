import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-quizlet',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './quizlet.component.html',
  styleUrl: './quizlet.component.css'
})
export class QuizletComponent {
  readonly grades = [
    { number: 1, title: 'GOD IS LOVE' },
    { number: 2, title: 'JESUS' },
    { number: 3, title: 'THE CHURCH' },
    { number: 4, title: 'FOLLOWING JESUS' },
    { number: 5, title: "THE CHURCH'S LITURGY" },
    { number: 6, title: 'THE BIBLE', url: 'https://quizlet.com/user/Sharbel_Sadaka/folders/the-bible' },
    { number: 7, title: 'OUR MARONITE FAITH' },
    { number: 8, title: 'OUR MARONITE CHURCH HISTORY' }
  ];
}
