import { Component, Input, OnInit } from '@angular/core';
import type { PhotoCollageImageGroups } from './photo-collage-images';

type PhotoSize = 'small' | 'medium' | 'large';

interface CollageSlot {
  size: PhotoSize;
  x: string;
  y: string;
  mobileX: number;
  mobileY: number;
  layer: number;
}

interface CollageTile extends CollageSlot {
  src: string;
}

const COLLAGE_SLOTS: readonly CollageSlot[] = [
  { size: 'large', x: 'calc(50% - min(31cqw, 66cqh))', y: '50%', mobileX: 28, mobileY: 30, layer: 1 },
  { size: 'large', x: '50%', y: '50%', mobileX: 50, mobileY: 30, layer: 1 },
  { size: 'large', x: 'calc(50% + min(31cqw, 66cqh))', y: '50%', mobileX: 72, mobileY: 30, layer: 1 },
  { size: 'medium', x: 'calc(50% - min(31cqw, 66cqh) + var(--large-medium-offset))', y: 'calc(50% - var(--large-medium-offset))', mobileX: 20.5, mobileY: 24, layer: 1 },
  { size: 'medium', x: 'calc(50% - min(31cqw, 66cqh) - var(--large-medium-offset))', y: 'calc(50% + var(--large-medium-offset))', mobileX: 20.5, mobileY: 36, layer: 1 },
  { size: 'medium', x: 'calc(50% + min(31cqw, 66cqh) + var(--large-medium-offset))', y: 'calc(50% - var(--large-medium-offset))', mobileX: 79.5, mobileY: 24, layer: 1 },
  { size: 'medium', x: 'calc(50% + min(31cqw, 66cqh) - var(--large-medium-offset))', y: 'calc(50% + var(--large-medium-offset))', mobileX: 79.5, mobileY: 36, layer: 1 },
  { size: 'small', x: 'calc(50% - min(31cqw, 66cqh) - var(--large-small-offset))', y: 'calc(50% - var(--large-small-offset))', mobileX: 10.1, mobileY: 24, layer: 1 },
  { size: 'small', x: 'calc(50% + var(--large-small-offset))', y: 'calc(50% - var(--large-small-offset))', mobileX: 50, mobileY: 21.3, layer: 1 },
  { size: 'small', x: 'calc(50% - var(--large-small-offset))', y: 'calc(50% + var(--large-small-offset))', mobileX: 50, mobileY: 38.7, layer: 1 },
  { size: 'small', x: 'calc(50% + min(31cqw, 66cqh) + var(--large-small-offset))', y: 'calc(50% + var(--large-small-offset))', mobileX: 89.9, mobileY: 36, layer: 1 }
];

const PHOTO_SIZES: readonly PhotoSize[] = ['small', 'medium', 'large'];

@Component({
  selector: 'app-photo-collage',
  standalone: true,
  host: { ngSkipHydration: 'true' },
  templateUrl: './photo-collage.component.html',
  styleUrl: './photo-collage.component.css'
})
export class PhotoCollageComponent implements OnInit {
  @Input() images: PhotoCollageImageGroups = { small: [], medium: [], large: [] };

  tiles: CollageTile[] = [];

  ngOnInit(): void {
    this.tiles = [];
    for (const size of PHOTO_SIZES) {
      const shuffledImages = this.shuffle([...this.images[size]]);
      const slots = COLLAGE_SLOTS.filter((slot) => slot.size === size);
      const photoCount = Math.min(shuffledImages.length, slots.length);
      if (!photoCount) {
        continue;
      }

      const slotStep = slots.length / photoCount;
      const slotOffset = Math.random() * slotStep;

      for (let index = 0; index < photoCount; index += 1) {
        const slot = slots[Math.floor(slotOffset + index * slotStep)];
        const source = shuffledImages.pop();
        if (slot && source) {
          this.tiles.push({ ...slot, src: source });
        }
      }
    }
  }

  private shuffle<T>(items: T[]): T[] {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }

    return items;
  }
}
