import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should hide the back button on the community hub', () => {
    const router = TestBed.inject(Router);
    spyOnProperty(router, 'url', 'get').and.returnValue('/');

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.back-button')).toBeNull();
  });

  it('should use browser history when an in-app previous navigation exists', () => {
    const location = TestBed.inject(Location);
    spyOn(location, 'getState').and.returnValue({ navigationId: 2 });
    const back = spyOn(location, 'back');

    fixture.componentInstance.goBack();

    expect(back).toHaveBeenCalled();
  });

  it('should return to the current community when no previous navigation exists', () => {
    const location = TestBed.inject(Location);
    spyOn(location, 'getState').and.returnValue({});
    const router = TestBed.inject(Router);
    spyOnProperty(router, 'url', 'get').and.returnValue('/mcf/events');
    const navigateByUrl = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    fixture.componentInstance.goBack();

    expect(navigateByUrl).toHaveBeenCalledWith('/mcf');
  });
});
