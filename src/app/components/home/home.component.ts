import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private ngZone: NgZone
  ) {}

  goToEvents() {
    this.router.navigate(['/events']);
  }

  images: string[] = [
    'assets/images/CurrentMYA.JPG',
    'assets/images/PSPeeps.jpg'    
  ];

  pImages: string[] = [
    'assets/images/Puttshack.JPG',
    'assets/images/StSMass.JPG'
  ]

  currentIndex: number = 0;
  pCurrentIndex: number = 0;

  // ngOnInit() {
  //   console.log("🔹 HomeComponent initialized");
  // }
  intervalId: any;
  pIntervalId: any;

  ngOnInit() {
    console.log("🔹 HomeComponent initialized");
    this.startSlideshow();
    this.startPSlideshow();
  }
  startSlideshow() {
    console.log("🔹 Slideshow started");

    // Run outside Angular to prevent hydration issues
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.currentIndex = (this.currentIndex + 1) % this.images.length;
          console.log("🔹 Changing slide to index:", this.currentIndex);
        });
      }, 3000);
    });
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
      }, 3000);
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.pIntervalId) {
      clearInterval(this.pIntervalId);
    }
  }

  // startSlideshow() {
  //   console.log("🔹 Slideshow started");
  
  //   let counter = 0; // Track iterations
  //   const updateSlide = () => {
  //     if (counter >= 5) { // Stop after 5 iterations for debugging
  //       console.log("🔹 Stopping slideshow after 5 iterations");
  //       return;
  //     }
  
  //     this.currentIndex = (this.currentIndex + 1) % this.images.length;
  //     console.log("🔹 Changing slide to index:", this.currentIndex);
  
  //     counter++;
  
  //     setTimeout(updateSlide, 3000); // Wait 3 seconds before updating again
  //   };
  
  //   updateSlide();
  // }
  

  // ngOnDestroy() {
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId); // Prevent memory leaks
  //   }
  // }
}
