import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAdvisorComponent } from './request-advisor.component';

describe('RequestAdvisorComponent', () => {
  let component: RequestAdvisorComponent;
  let fixture: ComponentFixture<RequestAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAdvisorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid if required fields are empty', () => {
    component.requestAdvisorForm.setValue({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      contactMethod: '',
      message: ''
    });
    expect(component.requestAdvisorForm.invalid).toBeTrue();
  });

  it('should mark form as valid with all required fields filled', () => {
    component.requestAdvisorForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      contactMethod: 'email',
      message: 'I need advice'
    });
    expect(component.requestAdvisorForm.valid).toBeTrue();
  });

  it('should reset the form after submission', () => {
    spyOn(window, 'alert');
    component.requestAdvisorForm.setValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '9876543210',
      contactMethod: 'phone',
      message: 'Help needed'
    });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Successfully submitted');
    expect(component.requestAdvisorForm.value).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      contactMethod: null,
      message: ''
    });
  });
});
