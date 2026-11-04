import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

export interface PhotoBookImage {
  filename: string;
  category: PhotoCategory;
  src: string;
}

export type PhotoCategory = 'MCF' | 'MYO' | 'MYA';

const PHOTO_FILENAMES = [
  'CurrentMYA.JPG',
  'MCF_Choir.JPG',
  'MCF_Christmas.jpeg',
  'MCF_Crafts.jpeg',
  'MCF_Dabke.jpeg',
  'MCF_Dabke1.jpeg',
  'MCF_Dabke2.JPG',
  'MCF_Day_1.JPG',
  'MCF_Dima.jpeg',
  'MCF_Halloween.jpg',
  'MYA_Da_GOAT.jpeg',
  'MYA_Saj.jpeg',
  'MYA_Service_3_amigos.jpeg',
  'MYA_Service_VolDin.JPG',
  'MYA_Social_Festival.jpeg',
  'MYA_Social_Hafli.JPG',
  'MYA_Social_Icecream.JPG',
  'MYA_Social_OG.JPG',
  'MYA_Social_Putt.jpg',
  'MYA_Spiritual_Easter.JPG',
  'MYA_Spiritual_Easter1.JPG',
  'MYA_Spritual_Breakfest.JPG',
  'MYA_Spritual_Center.JPG',
  'MYO_1.JPG',
  'MYO_2.JPEG',
  'MYO_3.JPG',
  'MYO_4.JPG',
  'MYO_5.JPEG',
  'MYO_6.JPEG',
  'MYO_7.jpg',
  'MYO_8.PNG',
  'MYO_9.JPEG',
  'MYO_10.JPG',
  'MYO_11.JPG',
  'MYO_12.JPG',
  'MYO_13.JPG',
  'MYO_Bowling.JPG'
] as const;

@Component({
  selector: 'app-photo-book',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './photo-book.component.html',
  styleUrl: './photo-book.component.css'
})
export class PhotoBookComponent {
  @ViewChild('viewerClose') private viewerClose?: ElementRef<HTMLButtonElement>;

  readonly categories: Array<'All photos' | PhotoCategory> = ['All photos', 'MCF', 'MYO', 'MYA'];
  readonly photos: PhotoBookImage[] = PHOTO_FILENAMES.map(filename => ({
    filename,
    category: this.getPhotoCategory(filename),
    src: `/assets/images/${encodeURIComponent(filename)}`
  }));

  selectedCategory: 'All photos' | PhotoCategory = 'All photos';
  selectedPhoto: PhotoBookImage | null = null;
  private opener: HTMLElement | null = null;

  get filteredPhotos(): PhotoBookImage[] {
    return this.selectedCategory === 'All photos'
      ? this.photos
      : this.photos.filter(photo => photo.category === this.selectedCategory);
  }

  selectCategory(category: 'All photos' | PhotoCategory): void {
    this.selectedCategory = category;
  }

  getAccessiblePhotoLabel(photo: PhotoBookImage): string {
    return `View ${photo.category} community photo full-screen`;
  }

  getAccessiblePhotoDescription(photo: PhotoBookImage): string {
    return `${photo.category} community photo`;
  }

  openPhoto(photo: PhotoBookImage): void {
    this.opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.selectedPhoto = photo;
    setTimeout(() => this.viewerClose?.nativeElement.focus());
  }

  closePhoto(): void {
    this.selectedPhoto = null;
    this.opener?.focus();
    this.opener = null;
  }

  handleBackdropClick(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Element && target.closest('.viewer-image, .viewer-close, .viewer-download')) return;
    this.closePhoto();
  }

  handleViewerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePhoto();
      return;
    }

    if (event.key !== 'Tab') return;

    const controls = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button, a[href]')
    );
    if (!controls.length) return;

    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private getPhotoCategory(filename: string): PhotoCategory {
    if (filename.startsWith('MCF_')) return 'MCF';
    if (filename.startsWith('MYO_')) return 'MYO';
    if (filename.startsWith('MYA_') || filename.toUpperCase().startsWith('CURRENTMYA')) return 'MYA';
    throw new Error(`Photo does not have a supported category: ${filename}`);
  }
}
