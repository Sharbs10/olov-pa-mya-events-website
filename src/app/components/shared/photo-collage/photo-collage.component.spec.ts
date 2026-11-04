import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { PhotoCollageComponent } from './photo-collage.component';
import type { PhotoCollageImageGroups } from './photo-collage-images';

describe('PhotoCollageComponent', () => {
  let fixture: ComponentFixture<PhotoCollageComponent>;
  let component: PhotoCollageComponent;

  const images: PhotoCollageImageGroups = {
    small: ['small-1.jpg', 'small-2.jpg'],
    medium: ['medium-1.jpg', 'medium-2.jpg'],
    large: ['large-1.jpg', 'large-2.jpg']
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCollageComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCollageComponent);
    component = fixture.componentInstance;
    component.images = images;
  });

  afterEach(() => fixture.destroy());

  it('fades only one random photo at a time with a slower transition and interval', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0);

    fixture.detectChanges();
    const initialSources = component.tiles.map(tile => tile.src);

    tick(1999);
    fixture.detectChanges();
    expect(component.tiles.some(tile => tile.isFading)).toBeFalse();

    tick(1);
    fixture.detectChanges();
    expect(component.tiles.filter(tile => tile.isFading).length).toBe(1);

    const changedTileIndex = component.tiles.findIndex(tile => tile.isFading);
    const changedTile = component.tiles[changedTileIndex];
    tick(1500);
    fixture.detectChanges();
    expect(component.tiles.filter(tile => tile.isFading).length).toBe(1);
    expect(changedTile?.src).not.toBe(initialSources[changedTileIndex]);

    tick(50);
    fixture.detectChanges();
    expect(component.tiles.filter(tile => tile.isFading).length).toBe(0);

    tick(1500 + 1999);
    fixture.detectChanges();
    expect(component.tiles.some(tile => tile.isFading)).toBeFalse();

    tick(1);
    fixture.detectChanges();
    expect(component.tiles.filter(tile => tile.isFading).length).toBe(1);
  }));
});
