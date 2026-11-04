import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PhotoBookComponent } from './photo-book.component';

describe('PhotoBookComponent', () => {
  let component: PhotoBookComponent;
  let fixture: ComponentFixture<PhotoBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoBookComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows all unique browser-viewable photos without displaying filenames', () => {
    const element = fixture.nativeElement as HTMLElement;
    const images = element.querySelectorAll<HTMLImageElement>('.photo-card img');

    expect(images.length).toBe(37);
    expect(new Set(component.photos.map(photo => photo.filename)).size).toBe(37);
    expect(element.querySelector('.photo-book-heading')?.textContent).toContain('Browse 37 photos');
    expect(element.querySelector('.photo-grid')?.textContent?.trim()).toBe('');
    expect(element.querySelectorAll('.photo-filters button').length).toBe(4);
    expect(element.querySelector('.photo-filters')?.textContent).not.toContain('Others');
    expect(Array.from(images).every(image =>
      image.loading === 'lazy' &&
      image.alt.length > 0 &&
      !component.photos.some(photo => image.alt.includes(photo.filename))
    )).toBeTrue();
    expect(element.querySelector('.photo-card img[src="/assets/images/MCF_Halloween.jpg"]')).not.toBeNull();
    expect(element.querySelector('.photo-card img[src="/assets/images/MYO_7.jpg"]')).not.toBeNull();
    expect(getComputedStyle(images[0]).objectFit).toBe('contain');
  });

  it('filters photos into MCF, MYO, and MYA groups', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(component.categories).toEqual(['All photos', 'MCF', 'MYO', 'MYA']);
    expect(component.filteredPhotos.length).toBe(37);

    component.selectCategory('MCF');
    fixture.detectChanges();
    expect(component.filteredPhotos.length).toBe(9);
    expect(element.querySelectorAll('.photo-card img').length).toBe(9);
    expect(Array.from(component.filteredPhotos).every(photo => photo.category === 'MCF')).toBeTrue();

    component.selectCategory('MYO');
    fixture.detectChanges();
    expect(component.filteredPhotos.length).toBe(14);

    component.selectCategory('MYA');
    fixture.detectChanges();
    expect(component.filteredPhotos.length).toBe(14);

    const activeFilter = element.querySelector<HTMLButtonElement>('.photo-filters button.active');
    expect(activeFilter?.textContent?.trim()).toBe('MYA');
    expect(activeFilter?.getAttribute('aria-pressed')).toBe('true');
  });

  it('opens the selected photo full-screen with a download link', () => {
    const photo = component.photos[0];
    component.openPhoto(photo);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const dialog = element.querySelector('[role="dialog"]');
    const image = dialog?.querySelector<HTMLImageElement>('.viewer-image');
    const download = dialog?.querySelector<HTMLAnchorElement>('.viewer-download');

    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(image?.src).toContain(photo.filename);
    expect(image?.alt).toBe('MYA community photo');
    expect(download?.href).toContain(photo.filename);
    expect(download?.getAttribute('download')).toBe(photo.filename);
    expect(getComputedStyle(download!).top).toBe('12px');
    expect(getComputedStyle(download!).left).toBe('12px');
  });

  it('closes when clicking outside the photo but stays open when clicking the photo or controls', () => {
    component.openPhoto(component.photos[0]);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const image = element.querySelector<HTMLImageElement>('.viewer-image');
    const download = element.querySelector<HTMLAnchorElement>('.viewer-download');
    const close = element.querySelector<HTMLButtonElement>('.viewer-close');

    image?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(component.selectedPhoto).not.toBeNull();

    download?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(component.selectedPhoto).not.toBeNull();

    close?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(component.selectedPhoto).toBeNull();

    component.openPhoto(component.photos[0]);
    fixture.detectChanges();
    element.querySelector('.photo-viewer')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(component.selectedPhoto).toBeNull();
  });

  it('closes the viewer with Escape and restores focus to the photo', () => {
    const photoButton = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.photo-card');
    photoButton?.focus();
    component.openPhoto(component.photos[0]);
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    fixture.nativeElement.querySelector('.photo-viewer')?.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.selectedPhoto).toBeNull();
    expect(document.activeElement).toBe(photoButton);
  });
});
