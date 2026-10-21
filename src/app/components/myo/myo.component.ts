import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { PhotoCollageComponent } from '../shared/photo-collage/photo-collage.component';

@Component({
  selector: 'app-myo',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, PhotoCollageComponent],
  templateUrl: './myo.component.html',
  styleUrl: '../shared/menu-page.css'
})
export class MyoComponent {
  readonly backgroundImages = Array(8).fill('assets/images/MYO_Bowling.JPG');
}
