import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgottenUsernameComponent } from './forgotten-username.component';

describe('ForgottenUsernameComponent', () => {
  let component: ForgottenUsernameComponent;
  let fixture: ComponentFixture<ForgottenUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgottenUsernameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgottenUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
