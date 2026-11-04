import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('only shows MYA social links on MYA pages', () => {
    const router = TestBed.inject(Router);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[aria-label="MYA Linktree"]')).toBeNull();
    expect(element.querySelector('[aria-label="MYA Instagram"]')).toBeNull();

    const url = spyOnProperty(router, 'url', 'get').and.returnValue('/mya/calendar');
    fixture.detectChanges();

    expect(element.querySelector('[aria-label="MYA Linktree"]')).not.toBeNull();
    expect(element.querySelector('[aria-label="MYA Instagram"]')).not.toBeNull();

    url.and.returnValue('/mcf/calendar');
    fixture.detectChanges();

    expect(element.querySelector('[aria-label="MYA Linktree"]')).toBeNull();
    expect(element.querySelector('[aria-label="MYA Instagram"]')).toBeNull();
  });
});
