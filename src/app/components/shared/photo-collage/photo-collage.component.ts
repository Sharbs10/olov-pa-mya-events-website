import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

interface PhotoTile {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PhotoInfo {
  src: string;
  aspectRatio: number;
}

type MosaicNode =
  | { aspectRatio: number; src: string }
  | {
      aspectRatio: number;
      direction: 'horizontal' | 'vertical';
      children: [MosaicNode, MosaicNode];
    };

@Component({
  selector: 'app-photo-collage',
  standalone: true,
  templateUrl: './photo-collage.component.html',
  styleUrl: './photo-collage.component.css'
})
export class PhotoCollageComponent implements AfterViewInit, OnDestroy {
  @Input() images: readonly string[] = [];
  @ViewChild('collage') private collage!: ElementRef<HTMLElement>;

  mosaic?: MosaicNode;
  tiles: PhotoTile[] = [];
  mosaicWidth = 0;
  mosaicHeight = 0;

  private resizeObserver?: ResizeObserver;
  private photoElements: HTMLImageElement[] = [];
  private layoutFrame?: number;
  private readonly onPhotoLoad = (): void => this.scheduleLayout();

  ngAfterViewInit(): void {
    this.photoElements = Array.from(this.collage.nativeElement.querySelectorAll('.photo-source'));
    this.shuffle(this.photoElements);
    this.photoElements.forEach((photo) => photo.addEventListener('load', this.onPhotoLoad));

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.scheduleLayout());
      this.resizeObserver.observe(this.collage.nativeElement);
    }

    this.scheduleLayout();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.layoutFrame !== undefined) {
      cancelAnimationFrame(this.layoutFrame);
    }
    this.photoElements.forEach((photo) => photo.removeEventListener('load', this.onPhotoLoad));
  }

  private shuffle<T>(items: T[]): void {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }
  }

  private scheduleLayout(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      this.layoutPhotos();
      return;
    }

    if (this.layoutFrame === undefined) {
      this.layoutFrame = requestAnimationFrame(() => {
        this.layoutFrame = undefined;
        this.layoutPhotos();
      });
    }
  }

  private layoutPhotos(): void {
    const { clientWidth: width, clientHeight: height } = this.collage.nativeElement;
    if (!width || !height || !this.photoElements.length) {
      return;
    }

    const photos = this.photoElements.map((photo): PhotoInfo => ({
      src: photo.src,
      aspectRatio: photo.naturalWidth && photo.naturalHeight
        ? photo.naturalWidth / photo.naturalHeight
        : 1
    }));
    const targetAspectRatio = width / height;
    let bestMosaic = this.buildMosaic(photos);
    let bestScore = this.scoreMosaic(bestMosaic, targetAspectRatio, photos.length);

    for (let attempt = 0; attempt < 256; attempt += 1) {
      const candidate = this.buildMosaic(photos);
      const score = this.scoreMosaic(candidate, targetAspectRatio, photos.length);
      if (score < bestScore) {
        bestMosaic = candidate;
        bestScore = score;
      }
    }

    this.mosaic = bestMosaic;
    this.mosaicWidth = Math.min(width, height * bestMosaic.aspectRatio);
    this.mosaicHeight = this.mosaicWidth / bestMosaic.aspectRatio;
    this.tiles = this.flattenMosaic(bestMosaic, 0, 0, 100, 100);
  }

  private flattenMosaic(
    mosaic: MosaicNode,
    x: number,
    y: number,
    width: number,
    height: number
  ): PhotoTile[] {
    if ('src' in mosaic) {
      return [{ src: mosaic.src, x, y, width, height }];
    }

    const [first, second] = mosaic.children;
    if (mosaic.direction === 'horizontal') {
      const firstWidth = width * (first.aspectRatio / mosaic.aspectRatio);
      return [
        ...this.flattenMosaic(first, x, y, firstWidth, height),
        ...this.flattenMosaic(second, x + firstWidth, y, width - firstWidth, height)
      ];
    }

    const firstHeight =
      height * ((1 / first.aspectRatio) / (1 / first.aspectRatio + 1 / second.aspectRatio));
    return [
      ...this.flattenMosaic(first, x, y, width, firstHeight),
      ...this.flattenMosaic(second, x, y + firstHeight, width, height - firstHeight)
    ];
  }

  private scoreMosaic(mosaic: MosaicNode, targetAspectRatio: number, photoCount: number): number {
    const aspectError = Math.abs(Math.log(mosaic.aspectRatio / targetAspectRatio));
    const sizeImbalance = this.getAreaFractions(mosaic).reduce(
      (total, fraction) => total + Math.log(fraction * photoCount) ** 2,
      0
    ) / photoCount;

    return aspectError + 0.2 * sizeImbalance;
  }

  private getAreaFractions(mosaic: MosaicNode): number[] {
    if ('src' in mosaic) {
      return [1];
    }

    const [first, second] = mosaic.children;
    const firstShare = mosaic.direction === 'horizontal'
      ? first.aspectRatio / mosaic.aspectRatio
      : (1 / first.aspectRatio) / (1 / first.aspectRatio + 1 / second.aspectRatio);
    const secondShare = 1 - firstShare;

    return [
      ...this.getAreaFractions(first).map((fraction) => fraction * firstShare),
      ...this.getAreaFractions(second).map((fraction) => fraction * secondShare)
    ];
  }

  private buildMosaic(photos: PhotoInfo[]): MosaicNode {
    if (photos.length === 1) {
      return { ...photos[0] };
    }

    const minSplit = Math.max(1, Math.floor(photos.length * 0.4));
    const maxSplit = Math.min(photos.length - 1, Math.ceil(photos.length * 0.6));
    const splitIndex = minSplit + Math.floor(Math.random() * (maxSplit - minSplit + 1));
    const first = this.buildMosaic(photos.slice(0, splitIndex));
    const second = this.buildMosaic(photos.slice(splitIndex));
    const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    const aspectRatio = direction === 'horizontal'
      ? first.aspectRatio + second.aspectRatio
      : 1 / (1 / first.aspectRatio + 1 / second.aspectRatio);

    return { aspectRatio, direction, children: [first, second] };
  }
}
