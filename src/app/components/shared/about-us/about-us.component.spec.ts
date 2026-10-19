import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AboutUsComponent } from './about-us.component';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows MYA Pillars linking to Spiritual, Social, and Service', () => {
    const pillarLinks = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.pillar-actions a');

    expect(Array.from(pillarLinks, link => link.textContent?.trim())).toEqual([
      'Spiritual',
      'Social',
      'Service'
    ]);
    expect(Array.from(pillarLinks, link => link.getAttribute('href'))).toEqual([
      '/mya/spiritual',
      '/mya/social',
      '/mya/service'
    ]);
  });

  it('does not show MCF resource links on About Us', () => {
    spyOnProperty(TestBed.inject(Router), 'url', 'get').and.returnValue('/mcf/about-us');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[aria-labelledby="mcf-resources-title"]')).toBeNull();
    expect(element.querySelector('.pillar-actions')).toBeNull();
  });
});
