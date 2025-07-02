import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
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
          <a routerLink="/dashboard/overview">Dashboard</a><br><br>
          <h2 class="__article_title">Welcome to Athena's Expense Tracking System</h2>
          <p class="__article_text">
            Step into smarter money management. Log in to access your personalized
            dashboard, track spending with precision, and gain insight into your
            financial habits. With Athena by your side, budgeting becomes effortless
            and decisions become clearer. Your financial clarity starts here.
          </p>
        </article>

        <aside class="__gutter">
          <form class="__form">

            <h2 class="__form_title">Sign In</h2>

            <p class="__article_text center sm-line-height">
              Smarter money management begins here...
            </p>

            <div class="__form_group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Username" required />
            </div>

            <div class="__form_group">
              <label for="password">Password</label>
              <input type="text" id="password" name="password" placeholder="password" required />
            </div>

            <div class="__form_action">
              <input type="submit" class="__button primary" value="Signin" />
            </div>

            <div class="__form_group">
              <span class="__article_text center sm-line-height">
                Forget your <a href="#">password</a> or <a href="#">username</a>?
              </span>
              <br>
              <span class="__article_text center sm-line-height">
                Not yet a member? <a href="#">Register</a>
              </span>
            </div>

          </form>
        </aside>

      </div>
    </div>
  `,
  styles: ``
})
export class SigninComponent {

}
