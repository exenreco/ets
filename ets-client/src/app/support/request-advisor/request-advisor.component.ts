import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormBuilder, Validator, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../security/auth.service';


@Component({
  selector: 'app-request-advisor',
  standalone: true,
  imports: [ ReactiveFormsModule, HttpClientModule ],
  template: `
    <div class="__page request-advisor-page">
      <div class="__grid columns form_container">
        <form [formGroup]="requestAdvisorForm" (ngSubmit)="onSubmit()">
          <div class="__form_group">
            <h2 class="__form_group">To request an advisor, fill out the form below</h2>
              <div class="__form_group">
                <label for="firstName">First Name</label>
                <input id="firstName" type="text" placeholder="Enter your first name" formControlName="firstName" />
              </div>

            <!-- Last Name input field -->
            <div class="__form_group">
              <label for="lastName">Last Name</label>
              <input id="lastName" type="text" placeholder="Enter your last name" formControlName="lastName" />
            </div>

            <!-- Email input field -->
            <div class="__form_group">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="Enter your email" formControlName="email" />
            </div>

            <!-- Phone input field -->
            <div class="__form_group">
              <label for="phone">Phone number</label>
              <input id="phone" type="tel" placeholder="Enter your phone number" formControlName="phone" />
            </div>

            <div class="__form_group __contact_method">
              <p>How would you like to be contacted?</p>
              <div class="__contact_options">
                <span class="__email_option">
                  <input type="radio" name="contactMethod" value="email" formControlName="contactMethod" />
                  <label>Email</label>
                </span>
                <span class="__phone_option">
                  <input type="radio" name="contactMethod" value="phone" formControlName="contactMethod" />
                  <label>Phone</label>
                </span>
              </div>
            </div>

            <div class="__form_group">
              <label for="message">What would you like to discuss with the advisor?</label>
               <textarea name="message" id="message" placeholder="Enter your message" rows="5" formControlName="message"></textarea>
            </div>

            <div class="__form_action">
              <input type="submit" class="__button tertiary" value="Request Advisor">
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
      .form_container {
      margin: 0;
      align-items: start;
      justify-content: start;
    }
    .form_container form {
      margin: 0;
    }
    .__form_group {
      width: 100%;
      align-items: start;
      justify-items: start;
      justify-content: left;
    }
    .__form_action {
      padding: 12px;
      display: flex;
      flex: 0 0 auto;
      align-items: right;
      flex-direction: row;
      justify-items: center;
      justify-content: right;
      width: calc(100% - 24px);
    }
    .__form_action input[type="submit"] {
      margin: 0 2rem 0 0;
      width: auto;
      max-width: 30%;
      min-width: 140px;
    }
    .__form_group h2 {
      font-size: 22px;
    }
    .__contact_options {
      display: flex;
      align-items: center;
    }
    .__email_option,
    .__phone_option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .__email_option {
      margin-right: 3.5rem;
    }
    .__contact_options label {
      margin-top: .75rem;
    }
  `
})
export class RequestAdvisorComponent {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  requestAdvisorForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    contactMethod: ['email', Validators.required],
    message: ['', Validators.required]
  });

  onSubmit() {
    alert('Successfully submitted');
    this.requestAdvisorForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      contactMethod: null,
      message: ''
    });
  }
}
