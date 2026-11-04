import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { GOSPEL_STORIES } from './gospel-stories.data';

@Component({
  selector: 'app-daily-video',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './daily-video.component.html',
  styleUrl: './daily-video.component.css'
})
export class DailyVideoComponent {
  readonly stories = GOSPEL_STORIES;
}
