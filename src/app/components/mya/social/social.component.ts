import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-mya-social',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  template: '<app-header></app-header><main class="placeholder"><h1>Social</h1><p>Social events and activities will be available here soon.</p></main><app-footer></app-footer>',
  styles: ['.placeholder { min-height: calc(100vh - 140px); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem; background: linear-gradient(to bottom, #a6d0fa, #fff); text-align: center; }']
})
export class SocialComponent {}
