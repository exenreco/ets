import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-global',
  standalone: true,
  imports: [ RouterLink ],
  template: `
    <div class="__grid rows __result">
      <h2 class="__widget_title">
        404 Error.
        <small>The page you are looking for does not exists<br>
        that's all we know...</small>
      </h2>
      <a class="return_home __article_link __has_icon" routerLink="/signin">
        <span class="__icon">
          <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </span>
        <span class="__title">Back to sign in</span>
      </a>
    </div>
  `,
  styles: `
    .__result {
      max-width: 1080px;
      min-width: 20em;
      margin: 18px auto 18px auto;
    }
    .__widget_title {
      width: 100%;
      display: flex;
      flex: 0 0 auto;
      line-height: 1.2rem;
      font-size: 1.245rem;
      font-weight: bolder;
      flex-direction: column;
      align-items: flex-start;
      justify-items: flex-start;
      justify-content: center;
    }
  `
})
export class ErrorGlobalComponent {

}
