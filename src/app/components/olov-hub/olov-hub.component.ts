import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { PhotoCollageComponent } from '../shared/photo-collage/photo-collage.component';
import { OLOV_HUB_COLLAGE_IMAGES } from '../shared/photo-collage/photo-collage-images';

@Component({
  selector: 'app-olov-hub',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, PhotoCollageComponent],
  templateUrl: './olov-hub.component.html',
  styleUrl: '../shared/menu-page.css'
})
export class OlovHubComponent {
  readonly backgroundImages = OLOV_HUB_COLLAGE_IMAGES;
}
