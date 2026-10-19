import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MyaComponent } from './mya.component';

describe('MyaComponent', () => {
  let component: MyaComponent;
  let fixture: ComponentFixture<MyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyaComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps the pillar links off the MYA landing page', () => {
    const titles = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.menu-card-title'),
      title => title.textContent?.trim()
    );

    expect(titles).toEqual(['About Us', 'Events', 'Calendar', 'Resources']);
  });
});
