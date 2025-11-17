import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit, OnDestroy {


  pCurrentIndex = 0;
  pIntervalId: any = null;
  isDesktop = true;
  pImages: string[] = [
    'assets/images/Puttshack.JPG',
    'assets/images/StSMass.JPG',
  ]

  constructor(
    private router: Router,
    private ngZone: NgZone, @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Only run this code in the browser
      this.checkScreenSize();
      window.addEventListener('resize', this.checkScreenSize.bind(this));
      this.startPSlideshow();
    }
  }

 checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth > 768;
    }
  }

   pausePSlideshow() {
    if (!isPlatformBrowser(this.platformId) || !this.isDesktop) return;

    if (this.pIntervalId) {
      clearInterval(this.pIntervalId);
      this.pIntervalId = null;
    }
  }

  resumePSlideshow() {
    if (!isPlatformBrowser(this.platformId) || !this.isDesktop) return;

    if (!this.pIntervalId) {
      this.startPSlideshow();
    }
  }

  startPSlideshow() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.pIntervalId && this.pImages.length > 0) {
      this.pIntervalId = setInterval(() => {
        this.pCurrentIndex = (this.pCurrentIndex + 1) % this.pImages.length;
      }, 3000); 
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.pIntervalId) clearInterval(this.pIntervalId);
      window.removeEventListener('resize', this.checkScreenSize.bind(this));
    }
  }
}
