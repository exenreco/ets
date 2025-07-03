import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorGlobalComponent } from './error-global.component';

describe('ErrorGlobalComponent', () => {
  let component: ErrorGlobalComponent;
  let fixture: ComponentFixture<ErrorGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorGlobalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
