import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OlovHubComponent } from './olov-hub.component';

describe('OlovHubComponent', () => {
  let component: OlovHubComponent;
  let fixture: ComponentFixture<OlovHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlovHubComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlovHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
