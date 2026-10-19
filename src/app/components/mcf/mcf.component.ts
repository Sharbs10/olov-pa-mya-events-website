import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-mcf',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './mcf.component.html',
  styleUrl: '../shared/menu-page.css'
})
export class McfComponent {}
