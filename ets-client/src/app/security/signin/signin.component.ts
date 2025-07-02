import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="signin">
      <h1 class="signin__title">Sign In</h1>

      @if(errorMessage) {
        <div class="message message--error">{{ errorMessage }}</div>
      }

      <form [formGroup]="signinForm" (ngSubmit)="signin();" class="signin__form">
        <div class="signin__form-group">
          <label for="username" class="signin__label">Username</label>
          <input id="username" placeholder="Enter your username" formControlName="username" type="text" class="signin__input" />
        </div>
        <div class="signin__form-group">
          <label for="password" class="signin__label">Password</label>
          <input id="password" placeholder="Enter your password" formControlName="password" type="password" class="signin__input" />
        </div>
        <input type="submit" class="signin__button" Value="Submit" />
      </form>
      <a href="/" class="returnToHomeLink">Return to Home</a>
    </div>
  `,
  styles: `
    //styling still needed
  `
})
export class SigninComponent {
  errorMessage: string;

  signinForm: FormGroup = this.fb.group({
    username: [null, Validators.compose([Validators.required])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}')])],
  });

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private cookieService: CookieService) { this.errorMessage = ''; }

  signin() {
    const username = this.signinForm.controls['username'].value;
    const password = this.signinForm.controls['password'].value;

    if (!this.signinForm.valid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.http.post(`${environment.apiBaseUrl}/security/signin`, { username, password }).subscribe({
      next: (response: any) => {
        console.log('Signin Response', response);

        const sessionUser = {
          username: response.username,
          role: response.role,
        }

        this.cookieService.set('sessionUser', JSON.stringify(sessionUser));

        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Signin Error', error);
        this.errorMessage = 'Invalid username or password'
      }
    });
  }
}
