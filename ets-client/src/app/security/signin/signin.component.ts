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

            <h2 class="__form_title center">Sign In</h2>

            <p class="__article_text center sm-line-height">
              Smarter money management begins here...
            </p>

            <div class="__form_group username_container">
              <label for="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                formControlName="username"
                [class.invalid]="signinForm.get('username')?.invalid && signinForm.get('username')?.touched"
              >
              <div
                class="__form-notification error"
                *ngIf="signinForm.get('username')?.invalid && signinForm.get('username')?.touched"
              ><p>Username is required</p></div>
              <div *ngIf="signinForm.get('username')?.errors?.['pattern'] && signinForm.get('username')?.touched" class="__form-notification error">
                <p>Username can only contain letters, numbers and underscores</p>
              </div>
            </div>

            <div class="__form_group">
              <label for="password">Password:</label>
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
                  <span *ngIf="!showPassword"><i class="fa-solid fa-eye"></i></span>
                  <span *ngIf="showPassword"><i class="fa-solid fa-eye-slash"></i></span>
                </button>
              </div>
              <div
                class="__form-notification error"
                *ngIf="signinForm.get('password')?.errors?.['required'] && signinForm.get('password')?.touched"
              ><p>Password is required</p></div>
              <div
                class="__form-notification error"
                *ngIf="signinForm.get('password')?.errors?.['pattern'] && signinForm.get('password')?.touched"
              ><p>
                - at least one lowercase letter<br>
                - at least one uppercase letter<br>
                - at least one digit<br>
                - only allows letters, digits, underscore, hyphen, dot, and tilde; minimum 8 characters</p>
              </div>
            </div>

            <div class="__grid rows" *ngIf="errorMsg.length > 0">
              <div class="__form-notification error" *ngFor="let err of errorMsg;">
                <p>{{ err }}</p>
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
  styles: `
    label {
      font-weight: bold;
    }
    .password_container {
      width: 100%;
      height: 40px;
      display: flex;
      flex: 0 0 auto;
      background: #fff;
      flex-direction: row;
      border-radius: .4em;
      border: 1px solid #dadada;
    }
      .password_container .toggle-password,
      .password_container input {
        margin: 0;
        padding: 0;
        border: 0px;
        border-radius: 0;
      }
      .password_container input {
        padding: 12px;
        width: calc(100% - 40px);
        max-width: calc(100% - 40px);
        min-width: calc(100% - 40px);
        border-top-left-radius: .4em;
        border-bottom-left-radius: .4em;
      }
      .password_container .toggle-password {
        right: 36px;
        width: 40px;
        height: 40px;
        border-top: none;
        background: #fff;
        position: absolute;
        border-right: none;
        border-bottom: none;
        border-top-right-radius: .4em;
        border-bottom-right-radius: .4em;
        border-left: 1px solid #dadada;
        color: var(--secondary-color, #DD2D4A);
      }
    .username_container {
      margin-bottom: 1em;
    }
    .username_container input {
      width: 100%;
      max-width: 100%;
      min-width: 100%;
    }
  `
})
export class SigninComponent implements OnInit {

  showPassword = false;

  errorMsg: string[] = [];

  signinForm = this.fb.group({
    username: [ '', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_]+$')
    ]],
    password: [ '', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9_.~-]{8,}$')
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



    const
      username = this.signinForm.controls['username'].value,
      password = this.signinForm.controls['password'].value
    ;

    this.errorMsg = []; // Clear previous errors if any

    this.signinForm.markAllAsTouched(); // touch to trigger validation messages

    if (!this.signinForm.valid) { // validity check
      this.authService.logout(); // log user out if signin
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
