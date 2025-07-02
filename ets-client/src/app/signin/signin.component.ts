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
          <a routerLink="/dashboard/overview">Dashboard</a><br><br>
          <h2>Welcome!</h2>
          <p>
            sdsd s sd sdsd sd sd sd sd dfdgfhdf fdgsdg dsg sd dsfds ds fds
            dfs fdsfds fds fds sdsd s sd sdsd sd sd sd sd dfdgfhdf fdgsdg dsg sd dsfds ds fds
            dfs fdsfds fds fds sdsd s sd sdsd sd sd sd sd dfdgfhdf fdgsdg dsg sd dsfds ds fds
            dfs fdsfds fds fdssdsd s sd sdsd sd sd sd sd dfdgfhdf fdgsdg dsg sd dsfds ds fds
            dfs fdsfds fds fds
          </p>
        </article>
        <aside class="__gutter">
          <form class="">
            <h2>Sign In</h2>
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
              <p>Forget your <a href="#">password</a>or <a href="#">username</a>?</p>
              <p>Not yet a member? <a href="#">Register</a></p>
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
