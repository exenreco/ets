import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotten-password',
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
            Placeholder title
          </h2>
          <p class="__article_text">
            Place holder text
            <a class="return_home __article_link __has_icon" routerLink="/">
                <span class="__icon">
                  <i class="fa-solid fa-arrow-right-to-bracket"></i>
                </span>
                <span class="__title">Back to sign in</span>
              </a>
          </p>
        </article>

        <aside class="__gutter">
          <form class="__form __reset" [formGroup]="resetPasswordForm" (ngSubmit)="onReset()">

            <h2 class="__form_title center">Reset Password</h2>

            <p class="__article_text center sm-line-height">
              some other text goes here...
            </p>

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
                *ngIf="resetPasswordForm.get('email')?.invalid && resetPasswordForm.get('email')?.touched"
              ><p>an email address is required</p></div>
              <div *ngIf="resetPasswordForm.get('email')?.errors?.['pattern'] && resetPasswordForm.get('email')?.touched" class="__form-notification error">
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
                placeholder="Username"
              />
              <div
                class="__form-notification error"
                *ngIf="resetPasswordForm.get('username')?.invalid && resetPasswordForm.get('username')?.touched"
              ><p>Username is required</p></div>
              <div *ngIf="resetPasswordForm.get('username')?.errors?.['pattern'] && resetPasswordForm.get('username')?.touched" class="__form-notification error">
                <p>Username can only contain letters, numbers and underscores</p>
              </div>
            </div>

            <div class="__form_group special">
              <label for="password">New Password:</label>
              <div class="password_container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  formControlName="password"
                  placeholder="New password"
                  [type]="showPassword ? 'text' : 'password'"
                  [class.invalid]="resetPasswordForm.get('password')?.invalid && resetPasswordForm.get('password')?.touched"
                />
                <button type="button" class="__button toggle-password" (click)="toggleVisibility('password'); $event.stopPropagation()">
                  <span *ngIf="!showPassword"><i class="fa-solid fa-eye"></i></span>
                  <span *ngIf="showPassword"><i class="fa-solid fa-eye-slash"></i></span>
                </button>
              </div>
              <div
                class="__form-notification error"
                *ngIf="resetPasswordForm.get('password')?.invalid && resetPasswordForm.get('password')?.touched"
              ><p>a new password is required</p></div>
              <div
                *ngIf="resetPasswordForm.get('password')?.errors?.['pattern'] && resetPasswordForm.get('password')?.touched"
                class="__form-notification error"
              ><p>
                - at least one lowercase letter<br>
                - at least one uppercase letter<br>
                - at least one digit<br>
                - only allows letters, digits, underscore, hyphen, dot, and tilde; minimum 8 characters</p>
              </div>
            </div>

            <div class="__form_group special">
              <label for="confirmPassword">Confirm New Password:</label>
              <div class="password_container">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  formControlName="confirmPassword"
                  placeholder="Confirm password"
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  [class.invalid]="resetPasswordForm.get('confirmPassword')?.invalid && resetPasswordForm.get('confirmPassword')?.touched"
                />
                <button type="button" class="__button toggle-password" (click)="toggleVisibility('confirm'); $event.stopPropagation()">
                  <span *ngIf="!showConfirmPassword"><i class="fa-solid fa-eye"></i></span>
                  <span *ngIf="showConfirmPassword"><i class="fa-solid fa-eye-slash"></i></span>
                </button>
              </div>
              <div
                class="__form-notification error"
                *ngIf="resetPasswordForm.get('confirmPassword')?.invalid && resetPasswordForm.get('confirmPassword')?.touched"
              ><p>you must confirm your new password</p></div>
              <div *ngIf="resetPasswordForm.get('password')?.value !== resetPasswordForm.get('confirmPassword')?.value && resetPasswordForm.get('confirmPassword')?.touched" class="__form-notification error">
                <p>New password must match confirm password</p>
              </div>
            </div>

            <div class="__grid rows" *ngIf="notifications.length > 0">
              <div class="__form-notification error" *ngFor="let err of notifications;">
                <p>{{ err }}</p>
              </div>
            </div>

            <div class="__form_action">
              <input
                type="submit"
                class="__button primary"
                value="Reset Password"
                [disabled]="
                  ! resetPasswordForm.valid ||
                  resetPasswordForm.get('password')?.value !== resetPasswordForm.get('confirmPassword')?.value
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
export class ForgottenPasswordComponent implements OnInit {

  showPassword: boolean = false;

  showConfirmPassword: boolean = false;

  notifications: string[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  resetPasswordForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    ]],
    username: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_]+$')
    ]],
    password: ['', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9_.~-]{8,}$')
    ]],
    confirmPassword: ['', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9_.~-]{8,}$')
    ]]
  });

  ngOnInit(): void {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated())
      this.router.navigate(['/dashboard']);
  }

  toggleVisibility(filter:string){
    if(filter === 'password') this.showPassword = !this.showPassword;
    if(filter === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }

  onReset(): void {

    // reset notifications
    this.notifications = [];

    // touch to trigger validation messages
    if( !this.resetPasswordForm.valid ) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const
      form = this.resetPasswordForm.value,

      params = {
        email:            form.email!,
        password:         form.password!,
        username:         form.username!,
        confirmPassword:  form.confirmPassword!,
      }
    ;

    if( confirm('You have requested a password change, confirm to continue.') ){
      this.authService.resetPassword(params).subscribe({
        next: (res: any) => {
          this.notifications.push(res.message);
          this.resetPasswordForm.reset()
        },
        error: (err: any) => {
          this.notifications.push(err.message);
          console.log(err.message)
        }
      });
    }
  }

}
