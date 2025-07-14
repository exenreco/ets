import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../security/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ RouterLink, ReactiveFormsModule, NgFor, NgIf ],
  template: `
    <div class="__page __account_setting">
      <div class="__container">

        <form class="__form __username" [formGroup]="usernameForm" (ngSubmit)="updateOne('username')">
          <h3 class="__form_title">Username Settings:</h3>
          <hr>
          <div class="__grid columns">

            <div class="__form_group">
              <span>Current username</span>
              <span class="__strong">{{ username }}</span>
              <span>
                <label for="currentUsername">Current username:</label>
                <input
                  type="text"
                  maxlength="30"
                  id="currentUsername"
                  name="currentUsername"
                  formControlName="currentUsername"
                  placeholder="Current username"
                >
                <div *ngIf="usernameForm.get('currentUsername')?.errors?.['serverMismatch']" class="__form-notification error">
                  <p>Username does not match your account credentials.</p>
                </div>
                <div *ngIf="usernameForm.get('currentUsername')?.errors?.['serverError']" class="__form-notification error">
                  <p>Unable to validate email. Please try again later.</p>
                </div>
                @if( isUsernameValid ){
                  <div class="__form-notification success">
                    <p><i class="fa-solid fa-circle-check"></i> verified!</p>
                  </div>
                } @else if( usernameForm.get('currentUsername')?.touched && usernameForm.get('currentUsername')?.invalid ) {
                  <div class="__form-notification error">
                    <p><i class="fa-solid fa-xmark"></i> Invalid!</p>
                  </div>
                }
              </span>
            </div>

            <div class="__form_group">
              <span>
                <label for="newUsername">New username:</label>
                <input
                  type="text"
                  minlength="5"
                  maxlength="30"
                  id="newUsername"
                  name="newUsername"
                  formControlName="newUsername"
                  placeholder="New username"
                >
                <div *ngIf="usernameForm.get('newUsername')?.invalid && usernameForm.get('newUsername')?.touched" class="__form-notification error">
                  <p>A new username of at least 5 characters is required</p>
                </div>
                <div *ngIf="usernameForm.get('newUsername')?.errors?.['pattern'] && usernameForm.get('newUsername')?.touched" class="__form-notification error">
                  <p>Username can only contain letters, numbers and underscores</p>
                </div>
                <div *ngIf="usernameForm.get('newUsername')?.value === usernameForm.get('currentUsername')?.value && usernameForm.get('confirmUsername')?.touched" class="__form-notification error">
                  Old username can\'t be used!
                </div>
              </span>
              <span>
                <label for="confirmUsername">Confirm new username:</label>
                <input
                  type="text"
                  maxlength="30"
                  id="confirmUsername"
                  name="confirmUsername"
                  formControlName="confirmUsername"
                  placeholder="Confirm new username"
                >
                <div *ngIf="usernameForm.get('confirmUsername')?.invalid && usernameForm.get('confirmUsername')?.touched" class="__form-notification error">
                  <p>you must confirm your new username</p>
                </div>
                <div *ngIf="usernameForm.get('confirmUsername')?.errors?.['pattern'] && usernameForm.get('confirmUsername')?.touched" class="__form-notification error">
                  <p>Username can only contain letters, numbers and underscores</p>
                </div>
                <div *ngIf="usernameForm.get('newUsername')?.value !== usernameForm.get('confirmUsername')?.value && usernameForm.get('confirmUsername')?.touched" class="__form-notification error">
                  <p>New username must match confirm username</p>
                </div>
              </span>
            </div>

          </div>

          <div class="grid rows" *ngIf="usernameMsg.length > 0">
            <div class="__form-notification error" *ngFor="let err of usernameMsg;">
              <p>{{ err }}</p>
            </div>
          </div>

          <div class="__form_action">
            <input
              type="submit"
              value="Update Username"
              class="__button primary"
              [disabled]="
                !isUsernameValid
                || usernameForm.invalid
                || usernameForm.get('currentUsername')?.value === usernameForm.get('newUsername')?.value
                || usernameForm.get('confirmUsername')?.value !== usernameForm.get('newUsername')?.value
              "
              [title]="usernameForm.invalid ? 'Please fix errors before submitting.' : ''"
            >
          </div>
        </form>

        <form class="__form __email" [formGroup]="emailForm" (ngSubmit)="updateOne('email')">
          <h3 class="__form_title">Email Settings:</h3>
          <hr>
          <div class="__grid columns">

            <div class="__form_group">
              <span>Current email</span>
              <span class="__strong">{{ email }}</span>
              <span>
                <label for="currentEmail">Confirm current email:</label>
                <input
                  type="email"
                  id="currentEmail"
                  name="currentEmail"
                  formControlName="currentEmail"
                  placeholder="Current Email"
                >
                <div *ngIf="emailForm.get('currentEmail')?.errors?.['serverMismatch']" class="__form-notification error">
                  <p>Email does not match your account credentials.</p>
                </div>
                <div *ngIf="emailForm.get('currentEmail')?.errors?.['serverError']" class="__form-notification error">
                  <p>Unable to validate email. Please try again later.</p>
                </div>
                @if( isEmailValid ){
                  <div class="__form-notification success">
                    <p><i class="fa-solid fa-circle-check"></i> verified!</p>
                  </div>
                } @else if( emailForm.get('currentEmail')?.touched && emailForm.get('currentEmail')?.invalid ) {
                  <div class="__form-notification error">
                    <p><i class="fa-solid fa-xmark"></i> Invalid!</p>
                  </div>
                }
              </span>
            </div>

            <div class="__form_group">
              <span>
                <label for="newEmail">New email:</label>
                <input
                  type="email"
                  id="newEmail"
                  name="newEmail"
                  formControlName="newEmail"
                  placeholder="New Email"
                >
                <div *ngIf="emailForm.get('newEmail')?.invalid && emailForm.get('newEmail')?.touched" class="__form-notification error">
                  <p>a new email is required</p>
                </div>
                <div *ngIf="emailForm.get('newEmail')?.errors?.['pattern'] && emailForm.get('newEmail')?.touched" class="__form-notification error">
                  <p>Please fill a valid email address</p>
                </div>
                <div *ngIf="emailForm.get('newEmail')?.value === emailForm.get('currentEmail')?.value && emailForm.get('confirmEmail')?.touched" class="__form-notification error">
                  <p>Old email can\'t be used!</p>
                </div>
              </span>
              <span>
                <label for="confirmEmail">Confirm new email:</label>
                <input
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  formControlName="confirmEmail"
                  placeholder="Confirm Email"
                >
                <div *ngIf="emailForm.get('confirmEmail')?.invalid && emailForm.get('confirmEmail')?.touched" class="__form-notification error">
                  <p>you must confirm your new email</p>
                </div>
                <div *ngIf="emailForm.get('confirmEmail')?.errors?.['pattern'] && emailForm.get('confirmEmail')?.touched" class="__form-notification error">
                  <p>Please enter a valid email</p>
                </div>
                <div *ngIf="emailForm.get('newEmail')?.value !== emailForm.get('confirmEmail')?.value && emailForm.get('confirmEmail')?.touched" class="__form-notification error">
                  <p>New email must match confirm email</p>
                </div>
              </span>
            </div>

          </div>
          <div class="__form_action">
            <input
              type="submit"
              value="Update Email"
              class="__button primary"
              [disabled]="
                !isEmailValid
                || emailForm.invalid
                || emailForm.get('currentEmail')?.value === emailForm.get('newEmail')?.value
                || emailForm.get('confirmEmail')?.value !== emailForm.get('newEmail')?.value
              "
              [title]="emailForm.invalid ? 'Please fix errors before submitting.' : ''"
            >
          </div>
        </form>

        <form class="__form __password" [formGroup]="passwordForm" (ngSubmit)="updateOne('password')">
          <h3 class="__form_title">Password Settings:</h3>
          <hr>
          <div class="__grid columns">

            <div class="__form_group">
              <span>
                <label for="currentPassword">Current password:</label>
                 <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  formControlName="currentPassword"
                  placeholder="Current Password"
                >
                <div *ngIf="passwordForm.get('currentPassword')?.errors?.['serverMismatch']" class="__form-notification error">
                  <p>Password does not match your account credentials.</p>
                </div>
                <div *ngIf="passwordForm.get('currentPassword')?.errors?.['serverError']" class="__form-notification error">
                  <p>Unable to validate password. Please try again later.</p>
                </div>
                @if( isPasswordValid ){
                  <div class="__form-notification success">
                    <p><i class="fa-solid fa-circle-check"></i> verified!</p>
                  </div>
                } @else if( passwordForm.get('currentPassword')?.touched && passwordForm.get('currentPassword')?.invalid ) {
                  <div class="__form-notification error">
                    <p><i class="fa-solid fa-xmark"></i> Invalid!</p>
                  </div>
                }
              </span>
            </div>

            <div class="__form_group">
              <span>
                <label for="newPassword">New password:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  formControlName="newPassword"
                  placeholder="New Password"
                >
                <div *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched" class="__form-notification error">
                  <p>a new password is required</p>
                </div>
                <div *ngIf="passwordForm.get('newPassword')?.errors?.['pattern'] && passwordForm.get('newPassword')?.touched" class="__form-notification error">
                  <p>- at least one lowercase letter<br>
                  - at least one uppercase letter<br>
                  - at least one digit<br>
                  - only allows letters, digits, underscore, hyphen, dot, and tilde; minimum 8 characters</p>
                </div>
                <div *ngIf="passwordForm.get('newPassword')?.value === passwordForm.get('currentPassword')?.value && passwordForm.get('confirmPassword')?.touched" class="__form-notification error">
                  <p>Old password can\'t be used!</p>
                </div>
              </span>
              <span>
                <label for="confirmPassword">Confirm new password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  formControlName="confirmPassword"
                  placeholder="confirmPassword"
                >
                <div *ngIf="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched" class="__form-notification error">
                  you must confirm your new password
                </div>
                <div *ngIf="passwordForm.get('confirmPassword')?.errors?.['pattern'] && passwordForm.get('confirmPassword')?.touched" class="__form-notification error">
                  <p>- at least one lowercase letter<br>
                  - at least one uppercase letter<br>
                  - at least one digit<br>
                  - only allows letters, digits, underscore, hyphen, dot, and tilde; minimum 8 characters</p>
                </div>
                <div *ngIf="passwordForm.get('newPassword')?.value !== passwordForm.get('confirmPassword')?.value && passwordForm.get('confirmPassword')?.touched" class="__form-notification error">
                  <p>New password must match confirm password</p>
                </div>
              </span>
            </div>

          </div>
          <div class="__form_action">
            <input
              type="submit"
              value="Update Password"
              class="__button primary"
              [disabled]="
                ! isPasswordValid
                || ! passwordForm.valid
                || passwordForm.get('currentPassword')?.value === passwordForm.get('newPassword')?.value
                || passwordForm.get('confirmPassword')?.value !== passwordForm.get('newPassword')?.value
              "
              [title]="passwordForm.invalid ? 'Please fix errors before submitting.' : ''"
            >
          </div>
        </form>

      </div>
    </div>
  `,
  styles: `
    .__grid.columns,
    .__form_group {
      margin: 0;
      align-items: flex-start;
      justify-items: flex-start;
      justify-content: left;
    }
    .__strong {
      font-weight: bolder;
    }
    .__form_group span {
      display: block;
      margin-bottom: 12px;
      width: calc(100% - 24px);
    }
    .__form_group input:not(input[type="submit"]) {
      height: 2px;
      width: calc(100% - 24px);
      max-width: calc(100% - 24px);
      min-width: calc(100% - 24px);
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
      margin: 0;
      width: auto;
      max-width: 30%;
      min-width: 140px;
    }
    .__notification {
      color: red;
      font-weight: bolder;
      text-align: center !important;
      align-items: center !important;
      margin-bottom: 12px !important;
      justify-items: center !important;
      justify-content: center !important;
      background: rgba(255,255,255,0.25);
    }
  `
})
export class SettingsComponent implements OnInit {
  // current user email address
  email: string = 'example@aets.com';

  // current user username
  username: string = 'user';

  // check entered password
  password: boolean = false;

  // is the current given email valid?
  isEmailValid: boolean = false;

  // is the current given password valid?
  isPasswordValid: boolean = false;

  // is the current given username valid?
  isUsernameValid: boolean = false;

  // notifications
  notifications: { [key: string]: string[] } = {
    email: [],
    password: [],
    username: [],
  };

  usernameMsg: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(

    private router: Router,

    private fb: FormBuilder,

    private authService:AuthService

  ){
    // display current user email
    this.authService.getUserEmail().subscribe({
      next: (email:string) => this.email = '****' + email.slice(3, -3) + '****',
      error: (err:any) =>{
        this.authService.handleAuthError(err);
        console.error('Email Error: ', err);
      }
    });

    // display current user username
    this.authService.getUsername().subscribe({
      next: (username:string) => this.username = username.slice(0, -3) + '***',
      error: (err:any) =>{
        this.authService.handleAuthError(err);
        console.error('Username Error: ', err);
      }
    });

    // check if entered username valid
    this.usernameForm.get('currentUsername')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentUsername => {
        if (currentUsername  === null || currentUsername  === '') {
          // handle null case, maybe return early or log error
          console.warn('Received null currentUsername');
          return;
        }
        this.authService.getUsername().subscribe({
          next: (res:string) => {
            const isValid = res === currentUsername;
            this.isUsernameValid = isValid;

            const currentControl = this.usernameForm.get('currentUsername');
            if (!isValid) currentControl?.setErrors({ serverMismatch: true });
            else {
              if (currentControl?.hasError('serverMismatch')) {
                currentControl?.updateValueAndValidity(); // refresh validation
                currentControl?.setErrors(null);
              }
            }
          },
          error: () => {
            this.isUsernameValid = false;
            this.emailForm.get('currentUsername')?.setErrors({ serverError: true });
          }
        })
      });

    // check if entered email valid
    this.emailForm.get('currentEmail')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentEmail => {
        if (currentEmail  === null || currentEmail  === '' ) {
          // handle null case, maybe return early or log error
          console.warn('Received null currentEmail');
          return;
        }
        this.authService.getUserEmail().subscribe({
          next: (res:string) => {
            const isValid = res === currentEmail;
            this.isEmailValid = isValid;

            const currentControl = this.emailForm.get('currentEmail');
            if (!isValid) currentControl?.setErrors({ serverMismatch: true });
            else {
              if (currentControl?.hasError('serverMismatch')) {
                currentControl?.updateValueAndValidity(); // refresh validation
                currentControl?.setErrors(null);
              }
            }
          },
          error: (err: any) => {
            this.isEmailValid = false;
            this.emailForm.get('currentEmail')?.setErrors({ serverError: true });
          }
        })
      });

    // check if entered password valid
    this.passwordForm.get('currentPassword')?.valueChanges
      .pipe( debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$) )
      .subscribe(currentPassword => {
        if (currentPassword === null || currentPassword === '' ) {
          // handle null case, maybe return early or log error
          console.warn('Received null currentUsername');
          return;
        }
        this.authService.isValidPassword(currentPassword).subscribe({
          next: ( res: string ) => {
            const isValid = res === currentPassword;
            this.isPasswordValid = isValid;

            const currentControl = this.passwordForm.get('currentPassword');
            if (!isValid) currentControl?.setErrors({ serverMismatch: true });
            else {
              if (currentControl?.hasError('serverMismatch')) {
                currentControl?.updateValueAndValidity(); // refresh validation
                currentControl?.setErrors(null);
              }
            }
          },
          error: (err: any) => {
            this.isPasswordValid = false;
            this.passwordForm.get('currentPassword')?.setErrors({ serverError: true });
          }
        });
      });
  }

  usernameForm = this.fb.group({
    newUsername: [ '', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_]+$')
    ]],
    currentUsername: [ '', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_]+$')
    ]],
    confirmUsername: [ '', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_]+$')
    ]]
  });

  emailForm = this.fb.group({
    newEmail: [ '', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    ]],
    currentEmail: [ '', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    ]],
    confirmEmail: [ '', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    ]]
  });

  passwordForm = this.fb.group({
    newPassword: [ '', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9_.~-]{8,}$')
    ]],
    currentPassword: [ '', [
      Validators.required
    ]],
    confirmPassword: [ '', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9_.~-]{8,}$')
    ]]
  });

  ngOnInit(): void {
    //if (this.emailForm.invalid) return;
    //if (this.usernameForm.invalid) return;
    //if (this.passwordForm.invalid) return;
  }

  updateOne( field:string ): void {
    let before, after;

    this.notifications['email'] = []; // Clear previous errors if any
    this.notifications['password'] = []; // Clear previous errors if any
    this.notifications['username'] = []; // Clear previous errors if any

    if(field === 'email') {
      before = this.emailForm.get('currentEmail')?.value,
      after = this.emailForm.get('newEmail')?.value;
      // touch to trigger validation messages
      if( !this.emailForm.valid ) {
        this.emailForm.markAllAsTouched();
        return;
      }

    } else if(field === 'password') {
      before = this.passwordForm.get('currentPassword')?.value,
      after = this.passwordForm.get('newPassword')?.value;
      // touch to trigger validation messages
      if( !this.passwordForm.valid ){
        this.passwordForm.markAllAsTouched();
        return;
      }

    } else if(field === 'username') {
      before = this.usernameForm.get('currentUsername')?.value,
      after = this.usernameForm.get('newUsername')?.value;
      // touch to trigger validation messages
      if( !this.usernameForm.valid ) {
        this.usernameForm.markAllAsTouched();
        return;
      }

    } else return;

    if ( ! before || ! after || typeof before !== 'string' || typeof after !== 'string' ){
      ( field && field === 'email' )
        ? this.emailForm.markAllAsTouched()
        : ( field && field === 'username' )
          ? this.usernameForm.markAllAsTouched()
          : ( field && field === 'password' )
          ? this.passwordForm.markAllAsTouched()
          : null;
      return;
    }

    this.authService.patchOneUserField({field: field, before: before, after: after}).subscribe({
      next: (res:any) => {
        console.log(res);
        if( res.status === 200 ) {
          ( field && field === 'email' )
            ? this.emailForm.reset()
            : ( field && field === 'username' )
              ? this.usernameForm.reset()
              : ( field && field === 'password' )
              ? this.passwordForm.reset()
              : null;
        }
      },
      error: (err: any) => {
        this.authService.handleAuthError(err);

        console.error('Username Update Error: ', err);

        if (err.status === 400)
          this.usernameMsg.push('Invalid request format');

        else if(err.status === 401)
           this.usernameMsg.push('Invalid username or password');

        else
          this.usernameMsg.push('Server error. Please try again later');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
