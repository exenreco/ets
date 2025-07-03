import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotten-password',
  standalone: true,
  imports: [RouterLink],
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
            <a class="__article_link __has_icon" routerLink="/">
                <span class="__icon">
                  <i class="fa-solid fa-arrow-right-to-bracket"></i>
                </span>
                <span class="__title">Back to sign in</span>
              </a>
          </p>
        </article>

        <aside class="__gutter">
          <form class="__form">

            <h2 class="__form_title">Reset Password</h2>

            <p class="__article_text center sm-line-height">
              some other text goes here...
            </p>

            <div class="__form_group">
              <label for="username">Some type of input</label>
              <input type="text" id="username" name="username" placeholder="Some type of input" required />
            </div>

            <div class="__form_action">
              <input type="submit" class="__button primary" value="Reset Password" />
            </div>

          </form>
        </aside>

      </div>
    </div>
  `,
  styles: ``
})
export class ForgottenPasswordComponent implements OnInit {

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
}
