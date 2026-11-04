import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import type { PhotoCollageImageGroups } from './photo-collage-images';

type PhotoSize = 'small' | 'medium' | 'large';

interface CollageSlot {
  size: PhotoSize;
  x: string;
  y: string;
  mobileX: string;
  mobileY: string;
  mobileVisible: boolean;
  layer: number;
}

interface CollageTile extends CollageSlot {
  imageOptions: string[];
  isFading: boolean;
  src: string;
}

const COLLAGE_SLOTS: readonly CollageSlot[] = [
  { size: 'large', x: 'calc(50% - min(31cqw, 66cqh))', y: '50%', mobileX: '50%', mobileY: '50%', mobileVisible: false, layer: 1 },
  { size: 'large', x: '50%', y: '50%', mobileX: '50%', mobileY: '50%', mobileVisible: true, layer: 1 },
  { size: 'large', x: 'calc(50% + min(31cqw, 66cqh))', y: '50%', mobileX: '50%', mobileY: '50%', mobileVisible: false, layer: 1 },
  { size: 'medium', x: 'calc(50% - min(31cqw, 66cqh) + var(--large-medium-offset))', y: 'calc(50% - var(--large-medium-offset))', mobileX: 'calc(50% - min(22.5cqw, 15.25cqh))', mobileY: 'calc(50% - min(45cqw, 30.5cqh))', mobileVisible: true, layer: 1 },
  { size: 'medium', x: 'calc(50% - min(31cqw, 66cqh) - var(--large-medium-offset))', y: 'calc(50% + var(--large-medium-offset))', mobileX: 'calc(50% - min(22.5cqw, 15.25cqh))', mobileY: 'calc(50% + min(45cqw, 30.5cqh))', mobileVisible: true, layer: 1 },
  { size: 'medium', x: 'calc(50% + min(31cqw, 66cqh) + var(--large-medium-offset))', y: 'calc(50% - var(--large-medium-offset))', mobileX: 'calc(50% + min(22.5cqw, 15.25cqh))', mobileY: 'calc(50% - min(45cqw, 30.5cqh))', mobileVisible: true, layer: 1 },
  { size: 'medium', x: 'calc(50% + min(31cqw, 66cqh) - var(--large-medium-offset))', y: 'calc(50% + var(--large-medium-offset))', mobileX: 'calc(50% + min(22.5cqw, 15.25cqh))', mobileY: 'calc(50% + min(45cqw, 30.5cqh))', mobileVisible: true, layer: 1 },
  { size: 'small', x: 'calc(50% - min(31cqw, 66cqh) - var(--large-small-offset))', y: 'calc(50% - var(--large-small-offset))', mobileX: '50%', mobileY: 'calc(50% - min(57.5cqw, 38.9722cqh))', mobileVisible: false, layer: 1 },
  { size: 'small', x: 'calc(50% + var(--large-small-offset))', y: 'calc(50% - var(--large-small-offset))', mobileX: '50%', mobileY: 'calc(50% - min(57.5cqw, 38.9722cqh))', mobileVisible: true, layer: 1 },
  { size: 'small', x: 'calc(50% - var(--large-small-offset))', y: 'calc(50% + var(--large-small-offset))', mobileX: '50%', mobileY: 'calc(50% + min(57.5cqw, 38.9722cqh))', mobileVisible: true, layer: 1 },
  { size: 'small', x: 'calc(50% + min(31cqw, 66cqh) + var(--large-small-offset))', y: 'calc(50% + var(--large-small-offset))', mobileX: '50%', mobileY: 'calc(50% + min(57.5cqw, 38.9722cqh))', mobileVisible: false, layer: 1 }
];

const PHOTO_SIZES: readonly PhotoSize[] = ['small', 'medium', 'large'];
const PHOTO_FADE_DURATION_MS = 1500;
const PHOTO_FADE_RESET_MS = 50;
const MIN_PHOTO_CHANGE_DELAY_MS = 2000;
const MAX_PHOTO_CHANGE_DELAY_MS = 7000;

@Component({
  selector: 'app-photo-collage',
  standalone: true,
  host: { ngSkipHydration: 'true' },
  templateUrl: './photo-collage.component.html',
  styleUrl: './photo-collage.component.css'
})
export class PhotoCollageComponent implements OnInit, OnDestroy {
  @Input() images: PhotoCollageImageGroups = { small: [], medium: [], large: [] };

  tiles: CollageTile[] = [];
  private slideshowTimer?: ReturnType<typeof setTimeout>;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit(): void {
    this.tiles = [];
    for (const size of PHOTO_SIZES) {
      const shuffledImages = this.shuffle([...this.images[size]]);
      const slots = COLLAGE_SLOTS.filter((slot) => slot.size === size);
      const photoCount = Math.min(shuffledImages.length, slots.length);
      if (!photoCount) {
        continue;
      }

      const imageOptions = [...shuffledImages];
      const mobileSlots = this.shuffle(slots.filter((slot) => slot.mobileVisible));
      const otherSlots = this.shuffle(slots.filter((slot) => !slot.mobileVisible));
      const selectedSlots = [...mobileSlots, ...otherSlots].slice(0, photoCount);

      for (let index = 0; index < photoCount; index += 1) {
        const slot = selectedSlots[index];
        const source = shuffledImages.pop();
        if (slot && source) {
          this.tiles.push({
            ...slot,
            imageOptions,
            isFading: false,
            src: source
          });
        }
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      this.scheduleNextPhoto();
    }
  }

  ngOnDestroy(): void {
    if (this.slideshowTimer) clearTimeout(this.slideshowTimer);
  }

  private scheduleNextPhoto(): void {
    if (!this.tiles.some(tile => tile.imageOptions.length > 1)) return;

    const delay = MIN_PHOTO_CHANGE_DELAY_MS +
      Math.random() * (MAX_PHOTO_CHANGE_DELAY_MS - MIN_PHOTO_CHANGE_DELAY_MS);
    this.slideshowTimer = setTimeout(() => {
      const candidates = this.tiles.filter(tile => tile.imageOptions.length > 1);
      const tile = candidates[Math.floor(Math.random() * candidates.length)];
      if (!tile) return;

      tile.isFading = true;
      this.slideshowTimer = setTimeout(() => {
        const alternatives = tile.imageOptions.filter(source => source !== tile.src);
        const nextSource = alternatives[Math.floor(Math.random() * alternatives.length)];
        if (nextSource) tile.src = nextSource;

        this.slideshowTimer = setTimeout(() => {
          tile.isFading = false;
          this.slideshowTimer = setTimeout(
            () => this.scheduleNextPhoto(),
            PHOTO_FADE_DURATION_MS
          );
        }, PHOTO_FADE_RESET_MS);
      }, PHOTO_FADE_DURATION_MS);
    }, delay);
  }

  private shuffle<T>(items: T[]): T[] {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }

    return items;
  }
}
