import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { PhotoCollageComponent } from '../shared/photo-collage/photo-collage.component';
import { MCF_COLLAGE_IMAGES } from '../shared/photo-collage/photo-collage-images';

@Component({
  selector: 'app-mcf',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, PhotoCollageComponent],
  templateUrl: './mcf.component.html',
  styleUrl: '../shared/menu-page.css'
})
export class McfComponent {
  readonly backgroundImages = MCF_COLLAGE_IMAGES;
}
