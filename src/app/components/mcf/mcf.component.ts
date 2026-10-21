import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { PhotoCollageComponent } from '../shared/photo-collage/photo-collage.component';

@Component({
  selector: 'app-mcf',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, PhotoCollageComponent],
  templateUrl: './mcf.component.html',
  styleUrl: '../shared/menu-page.css'
})
export class McfComponent {
  readonly backgroundImages = [
    'assets/images/MCF_Choir.JPG',
    'assets/images/MCF_Christmas.jpeg',
    'assets/images/MCF_Crafts.jpeg',
    'assets/images/MCF_Dabke.jpeg',
    'assets/images/MCF_Dabke1.jpeg',
    'assets/images/MCF_Dabke2.JPG',
    'assets/images/MCF_Day_1.JPG',
    'assets/images/MCF_Dima.jpeg'
  ];
}
