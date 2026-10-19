import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-olov-hub',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './olov-hub.component.html',
  styleUrl: '../shared/menu-page.css'
})
export class OlovHubComponent {}
