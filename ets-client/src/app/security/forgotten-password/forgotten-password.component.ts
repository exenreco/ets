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
            Having troubles logging in?
          </h2>
          <p class="__article_text">
            It happens to the best of us, but don't worry, we can help you reset your password.
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
          <form class="__form __reset" [formGroup]="resetPasswordForm" (ngSubmit)="onReset()">

            <h2 class="__form_title center">Reset Password</h2>

            <p class="__article_text center lg-line-height">
              Enter your email below to retrieve a secure reset link.
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
                [disabled]="! resetPasswordForm.valid"
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
    ]]
  });

  ngOnInit(): void {
    // Redirect to dashboard if already logged in
    if (this.authService.isAuthenticated())
      this.router.navigate(['/dashboard']);
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
