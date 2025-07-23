import { CommonModule } from '@angular/common';
import { AuthService, User } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  template: `
    <div class="__page none-auth registration">
      <div class="__grid columns">
        <article class="__content">
          <div class="__image_container landscape" style="background:#faf0e1;">
            <div
              class="__image_container portrait"
              style="background-image: url('/images/signin-screen.png');"
            ></div>
          </div>
          <h2 class="__article_title">
            Not yet a member of the expense tracking system?
          </h2>
          <p class="__article_text">
            No problem, you can create a new account in just a few steps.
            <br><br>
            <a class="return_home __article_link __has_icon" routerLink="/">
                <span class="__icon">
                  <i class="fa-solid fa-arrow-right-to-bracket"></i>
                </span>
                <span class="__title">Back to sign in</span>
              </a>
          </p>
        </article>

        <aside class="__gutter">
          <form class="__form __reset" [formGroup]="registrationForm" (ngSubmit)="onRegister()">

            <h2 class="__form_title center">Registration</h2>

            <p class="__article_text center lg-line-height">
              Fill out the form below to create a new account.
            </p>

            <div class="__form_group">
              <label for="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                formControlName="firstName"
                placeholder="example: John"
              />
              <div
                class="__form-notification error"
                *ngIf="registrationForm.get('firstName')?.invalid && registrationForm.get('firstName')?.touched"
              ><p>a first name is required</p></div>
              <div *ngIf="registrationForm.get('firstName')?.errors?.['pattern'] && registrationForm.get('firstName')?.touched" class="__form-notification error">
                <p>invalid first name pattern</p>
              </div>
            </div>

            <div class="__form_group">
              <label for="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                formControlName="lastName"
                placeholder="example: Doe"
              />
              <div
                class="__form-notification error"
                *ngIf="registrationForm.get('lastName')?.invalid && registrationForm.get('lastName')?.touched"
              ><p>a first name is required</p></div>
              <div *ngIf="registrationForm.get('lastName')?.errors?.['pattern'] && registrationForm.get('lastName')?.touched" class="__form-notification error">
                <p>invalid last name pattern</p>
              </div>
            </div>

            <div class="__form_group">
              <label for="email">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                formControlName="email"
                placeholder="example@domain.com"
              />
              <div
                class="__form-notification error"
                *ngIf="registrationForm.get('email')?.invalid && registrationForm.get('email')?.touched"
              ><p>an email address is required</p></div>
              <div *ngIf="registrationForm.get('email')?.errors?.['pattern'] && registrationForm.get('email')?.touched" class="__form-notification error">
                <p>invalid email pattern</p>
              </div>
            </div>

            <div class="__form_group">
              <label for="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                formControlName="username"
                placeholder="jDoe87"
              />
              <div
                class="__form-notification error"
                *ngIf="registrationForm.get('username')?.invalid && registrationForm.get('username')?.touched"
              ><p>a username is required</p></div>
              <div *ngIf="registrationForm.get('username')?.invalid && registrationForm.get('username')?.touched" class="__form-notification error">
                <p>A new username of at least 5 characters is required</p>
              </div>
              <div *ngIf="registrationForm.get('username')?.errors?.['pattern'] && registrationForm.get('username')?.touched" class="__form-notification error">
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
                  [class.invalid]="registrationForm.get('password')?.invalid && registrationForm.get('password')?.touched"
                />
                <button type="button" class="__button toggle-password" (click)="togglePasswordVisibility('password')">
                  <span *ngIf="!showPassword"><i class="fa-solid fa-eye"></i></span>
                  <span *ngIf="showPassword"><i class="fa-solid fa-eye-slash"></i></span>
                </button>
              </div>
              <div
                class="__form-notification error"
                *ngIf="registrationForm.get('password')?.errors?.['required'] && registrationForm.get('password')?.touched"
              ><p>Password is required</p></div>
              <div
                class="__form-notification error"
                *ngIf="registrationForm.get('password')?.errors?.['pattern'] && registrationForm.get('password')?.touched"
              ><p>
                - at least one lowercase letter<br>
                - at least one uppercase letter<br>
                - at least one digit<br>
                - only allows letters, digits, underscore, hyphen, dot, and tilde; minimum 8 characters</p>
              </div>
            </div>

            <div class="__form_group">
              <label for="confirmPassword">Confirm Password:</label>
              <div class="password_container">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  formControlName="confirmPassword"
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  [class.invalid]="registrationForm.get('confirmPassword')?.invalid && registrationForm.get('confirmPassword')?.touched"
                />
                <button type="button" class="__button toggle-password" (click)="togglePasswordVisibility('confirm')">
                  <span *ngIf="!showConfirmPassword"><i class="fa-solid fa-eye"></i></span>
                  <span *ngIf="showConfirmPassword"><i class="fa-solid fa-eye-slash"></i></span>
                </button>
              </div>
              <div
                class="__form-notification error"
                *ngIf="registrationForm.get('confirmPassword')?.errors?.['required'] && registrationForm.get('confirmPassword')?.touched"
              ><p>Confirm password must match password</p></div>
              <div *ngIf="registrationForm.get('password')?.value !== registrationForm.get('confirmPassword')?.value && registrationForm.get('confirmPassword')?.touched" class="__form-notification error">
                  <p>Confirm password must match the entered password</p>
                </div>
            </div>


            <div class="__grid rows" *ngIf="notifications && notifications.length > 0">
              <div class="__form-notification error" *ngFor="let err of notifications;">
                <p>{{ err }}</p>
              </div>
            </div>

            <div class="__form_action">
              <input
                type="submit"
                class="__button primary"
                value="Register"
                [disabled]="
                  ! registrationForm.valid ||
                  registrationForm.get('password')?.value !== registrationForm.get('confirmPassword')?.value
                "
              />
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
    .__form_group:not(.special):has(input) input {
      width: 100%;
      max-width: 100%;
      min-width: 100%;
    }
  `
})
export class RegistrationComponent implements OnInit {

  showPassword: boolean = false;

  showConfirmPassword: boolean = false;

  notifications: string[] | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  registrationForm = this.fb.group({
    lastName: ['', [
      Validators.required
    ]],
    firstName: ['', [
      Validators.required
    ]],
    email: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    ]],
    username: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern('^[a-zA-Z0-9_]+$')
    ]],
    password: ['', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9_.~-]{8,}$')
    ]],
    confirmPassword: ['', [
      Validators.required
    ]]
  });

  ngOnInit(): void {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated())
      this.router.navigate(['/dashboard']);
  }

  togglePasswordVisibility(field: 'password' | 'confirm' = 'password'): void {
    if (field === 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister(): void {
    this.notifications = null; // reset notifications

    // touch to trigger validation messages
    if (!this.registrationForm.valid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    const
      form = this.registrationForm.value,

      params = {
        email:           form.email!,
        firstName:       form.firstName!,
        lastName:        form.lastName!,
        username:        form.username!,
        password:        form.password!
      },

      newUser = params as User;
    ;
    if (confirm('You have requested to register a new account, confirm to continue.')) {
      this.authService.registerUser(newUser).subscribe({
        next: (res: any) => {
          console.log("res:", res);
          this.notifications = [];
          this.notifications.push(`${res.message}`);

          if (res.status === 'success') {
            this.notifications.push('Registration successful! Redirecting to sign-in page...');
            setTimeout(() => {
              // Clear the registration form
              this.registrationForm.reset();

              // redirect to sign-in page after 3 seconds
              this.router.navigate(['/signin']);
            }, 3000);
          }
        },
        error: (err: any) => {
          console.error("Err:", err);
          this.notifications = [];
          this.notifications.push(`${err.message}`);
          console.log(err.message);
        }
      });
      this.clearNotifications();
    } else {
      this.registrationForm.reset();
      if ( typeof this.notifications === 'string') {
        this.notifications = [];
        this.notifications.push('Registration cancelled.');
      } else if ( ! this.notifications ) {
        this.notifications = [];
        this.notifications.push('Registration cancelled.');
      }
      this.clearNotifications();
      console.log('Registration cancelled.');
    }
  }

  clearNotifications(): void {
    // Clear success message after 3 seconds
    setTimeout(() => {
      this.notifications = null;
    }, 3000);
  }
}
