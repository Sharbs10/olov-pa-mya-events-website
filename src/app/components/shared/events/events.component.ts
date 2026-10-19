import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit, OnDestroy {


  pCurrentIndex = 0;
  pIntervalId: ReturnType<typeof setInterval> | null = null;
  isDesktop = true;
  private readonly handleResize = () => this.checkScreenSize();
  pImages: string[] = [
    'assets/images/Puttshack.JPG',
    'assets/images/StSMass.JPG',
  ]

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Only run this code in the browser
      this.checkScreenSize();
      window.addEventListener('resize', this.handleResize);
      this.startPSlideshow();
    }
  }

 checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth > 768;
    }
  }

  pausePSlideshow(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.pIntervalId) {
      clearInterval(this.pIntervalId);
      this.pIntervalId = null;
    }
  }

  resumePSlideshow(): void {
    if (!isPlatformBrowser(this.platformId) || !this.isDesktop) return;

    if (!this.pIntervalId) {
      this.startPSlideshow();
    }
  }

  showPreviousPoster(): void {
    this.pCurrentIndex = (this.pCurrentIndex - 1 + this.pImages.length) % this.pImages.length;
    this.pausePSlideshow();
  }

  showNextPoster(): void {
    this.pCurrentIndex = (this.pCurrentIndex + 1) % this.pImages.length;
    this.pausePSlideshow();
  }

  startPSlideshow(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.pIntervalId && this.pImages.length > 0) {
      this.pIntervalId = setInterval(() => {
        this.pCurrentIndex = (this.pCurrentIndex + 1) % this.pImages.length;
      }, 3000); 
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.pIntervalId) clearInterval(this.pIntervalId);
      window.removeEventListener('resize', this.handleResize);
    }
  }
}
