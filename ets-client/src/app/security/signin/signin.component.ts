import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgFor, NgIf],
  template: `
    <div class="__page none-auth signin">
      <div class="__grid columns">

        <article class="__content">
          <div class="__image_container landscape" style="background:#faf0e1;">
            <div
              class="__image_container portrait"
              style="background-image: url('/images/signin-screen.png');"
            ></div>
          </div>
          <h2 class="__article_title">Welcome to Athena's Expense Tracking System</h2>
          <p class="__article_text">
            Step into smarter money management. Log in to access your personalized
            dashboard, track spending with precision, and gain insight into your
            financial habits. With Athena by your side, budgeting becomes effortless
            and decisions become clearer. Your financial clarity starts here.
          </p>
        </article>

        <aside class="__gutter">
          <form class="__form" [formGroup]="signinForm" (ngSubmit)="signin();">

            <h2 class="__form_title">Sign In</h2>

            <p class="__article_text center sm-line-height">
              Smarter money management begins here...
            </p>

            <div class="__form_group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                formControlName="username"
                [class.invalid]="signinForm.get('username')?.invalid && signinForm.get('username')?.touched"
              >
              <div
                class="error-text"
                *ngIf="signinForm.get('username')?.invalid && signinForm.get('username')?.touched"
              >Username is required</div>
            </div>

            <div class="__form_group">
              <label for="password">Password</label>
              <div class="password_container">
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  formControlName="password"
                  [type]="showPassword ? 'text' : 'password'"
                  [class.invalid]="signinForm.get('password')?.invalid && signinForm.get('password')?.touched"
                />
                <button type="button" class="__button toggle-password" (click)="togglePasswordVisibility()">
                  <span *ngIf="!showPassword">👁️</span>
                  <span *ngIf="showPassword">🔒</span>
                </button>
              </div>
              <div
                class="error-text"
                *ngIf="signinForm.get('password')?.errors?.['required'] && signinForm.get('password')?.touched"
              >Password is required</div>
              <div
                class="error-text"
                *ngIf="signinForm.get('password')?.errors?.['pattern'] && signinForm.get('password')?.touched"
              >Password must contain uppercase, lowercase, and number</div>
            </div>

            <div class="__form_action">
              <div class="grid rows" *ngIf="errorMsg.length > 0">
                <div
                  class="__notification error"
                  *ngFor="let err of errorMsg;"
                >{{ err }}</div>
              </div>
            </div>

            <div class="__form_action">
              <input type="submit" class="__button primary" value="Signin" />
            </div>

            <div class="__form_group">
              <span class="__article_text center sm-line-height">
                Forget your
                <a routerLink="/forgotten-password">password</a> or
                <a routerLink="/forgotten-username">username</a>?
              </span>
              <br>
              <span class="__article_text center sm-line-height">
                Not yet a member? <a routerLink="/registration">Register</a>
              </span>
            </div>

          </form>
        </aside>

      </div>
    </div>
  `,
  styles: ``
})
export class SigninComponent implements OnInit {

  showPassword = false;

  errorMsg: string[] = [];

  signinForm = this.fb.group({
    username: [ '', [Validators.required] ],
    password: [ '', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')
    ]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated())
      this.router.navigate(['/dashboard']);
  }

  togglePasswordVisibility() {

    this.showPassword = !this.showPassword;
  }

  signin() {

    this.authService.logout(); // log user out on signin

    const
      username = this.signinForm.controls['username'].value,
      password = this.signinForm.controls['password'].value
    ;

    this.errorMsg = []; // Clear previous errors if any

    this.signinForm.markAllAsTouched(); // touch to trigger validation messages

    if (!this.signinForm.valid) { // validity check

      if (this.signinForm.get('username')?.invalid)
        this.errorMsg.push('Username is required');

      if (this.signinForm.get('password')?.invalid) {

        if (this.signinForm.get('password')?.errors?.['required'])
          this.errorMsg.push('Password is required');

        if (this.signinForm.get('password')?.errors?.['pattern'])
          this.errorMsg.push('Password must be at least 8 characters with an uppercase, lowercase and number');
      }
      return;
    }

    this.authService.login( username!, password! ).subscribe({
      error: (err) => {

        this.authService.handleAuthError(err);

        console.error('Signin Error: ', err);

        if (err.status === 400) {

          this.errorMsg = ['Invalid request format'];

        } else if(err.status === 401) {

          this.errorMsg = ['Invalid username or password'];

        } else {

          this.errorMsg = ['Server error. Please try again later'];

        }
      }
    });

  }

}
