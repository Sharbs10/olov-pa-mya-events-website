import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  standalone: true,
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  constructor(private readonly router: Router) {}

  get communityPath(): string {
    const match = this.router.url.match(/^\/(mcf|myo|mya)(?:\/|$)/);
    return match ? `/${match[1]}` : '/mya';
  }

  get community(): { name: string; description: string } {
    switch (this.communityPath) {
      case '/mcf':
        return { name: 'MCF', description: 'Faith, learning, and community come together here.' };
      case '/myo':
        return { name: 'MYO', description: 'Connect with the young adult community and find your next step.' };
      default:
        return { name: 'MYA', description: 'Find a place to grow in faith, serve others, and build friendships.' };
    }
  }
}
