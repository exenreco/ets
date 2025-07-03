import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDashboardComponent } from './error-dashboard.component';

describe('ErrorDashboardComponent', () => {
  let component: ErrorDashboardComponent;
  let fixture: ComponentFixture<ErrorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
