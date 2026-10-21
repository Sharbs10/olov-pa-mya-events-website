import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { PhotoCollageComponent } from '../shared/photo-collage/photo-collage.component';

@Component({
  selector: 'app-mya',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, PhotoCollageComponent],
  templateUrl: './mya.component.html',
  styleUrl: '../shared/menu-page.css'
})
export class MyaComponent {
  readonly backgroundImages = [
    'assets/images/MYA_Da_GOAT.jpeg',
    'assets/images/MYA_Saj.jpeg',
    'assets/images/MYA_Service_3_amigos.jpeg',
    'assets/images/MYA_Service_VolDin.JPG',
    'assets/images/MYA_Social_Festival.jpeg',
    'assets/images/MYA_Social_Hafli.JPG',
    'assets/images/MYA_Social_Icecream.JPG',
    'assets/images/MYA_Social_OG.JPG',
    'assets/images/MYA_Social_Putt.jpg',
    'assets/images/MYA_Spiritual_Easter.JPG',
    'assets/images/MYA_Spiritual_Easter1.JPG',
    'assets/images/MYA_Spritual_Breakfest.JPG',
    'assets/images/MYA_Spritual_Center.JPG'
  ];
}
