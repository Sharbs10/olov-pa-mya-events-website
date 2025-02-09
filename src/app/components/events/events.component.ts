import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-events',
  imports: [CommonModule, RouterModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit, OnDestroy {
  
  constructor(
    private router: Router,
    private ngZone: NgZone
  ) {}

  pImages: string[] = [
    'assets/images/Puttshack.JPG',
    'assets/images/StSMass.JPG'
  ]

  pCurrentIndex: number = 0;
  pIntervalId: any;

  ngOnInit() {
    console.log("🔹 HomeComponent initialized");    
    this.startPSlideshow();
  }  
  
  startPSlideshow() {
    console.log("🔹 Event Slideshow started");

    // Run outside Angular to prevent hydration issues
    this.ngZone.runOutsideAngular(() => {
      this.pIntervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.pCurrentIndex = (this.pCurrentIndex + 1) % this.pImages.length;
          console.log("🔹 Changing Event slide to index:", this.pCurrentIndex);
        });
      }, 8000);
    });
  }

  // 🔹 Stop slideshow on hover
  pausePSlideshow() {
    console.log("🔹 Slideshow paused");
    if (this.pIntervalId) {
      clearInterval(this.pIntervalId);
      this.pIntervalId = null;
    }
  }

  // 🔹 Resume slideshow on hover out
  resumePSlideshow() {
    console.log("🔹 Slideshow resumed");
    if (!this.pIntervalId) {
      this.startPSlideshow();
    }
  }

  ngOnDestroy() {  
    if (this.pIntervalId) {
      clearInterval(this.pIntervalId);
    }
  }
}
