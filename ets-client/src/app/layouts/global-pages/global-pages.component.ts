import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-global-pages',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="__global_pages_header">
      <div class="container">
        <section class="__site_info">
          <h1 class="__site_title">Athena's</h1>
          <p class="__site_tagline">Expense Tracking System</p>
        </section>
      </div>
    </header>
    <main class="__global_page_contents">
      <div class="container"><router-outlet></router-outlet></div>
    </main>
    <footer class="__global_pages_footer">
      <p class="__copyright_text">&copy; 2025 Athena's Expense Tracking System</p>
    </footer>
  `,
  styles: `
    /* Global template page sections */

    .__global_pages_header,
    .__global_page_contents,
    .__global_pages_footer {
      width: 100%;
      margin: auto;
      display: flex;
      min-width: 100%;
      max-width: 100%;
      box-sizing: none;
      position: relative;
    }

    .__global_pages_header {
      top: 0;
      left: 0;
      right: 0;
      z-index: 3;
      color: #ffffff;
      height: 6.42em;
      flex: 0 0  auto;
      position: fixed;
      flex-wrap: nowrap;
      flex-direction: row;
      align-items: center;
      justify-items: center;
      justify-content: center;
      background-color: var(--primary-color, #880D1E);
      border-bottom: .4em solid var(--primary-color-shade, #F26A8D);
    }
    .__global_page_contents {
      z-index: 2;
      height: auto;
      display: block;
      position: relative;
      margin-top: 6.82em;
      margin-bottom: 2.425em;
      min-height: calc(100vh - 6.82em);
      background: var(--background-color, rgb(222, 232, 247));
    }
    .__global_pages_footer {
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      flex: 0 0  auto;
      position: fixed;
      flex-direction: row;
      align-items: center;
      justify-items: center;
      justify-content: center;
      background-color: var(--primary-color, #880D1E);
    }



    /* Header style rules */
    .__global_pages_header .container {
      width: 100%;
      margin: auto;
      padding: 12px;
      display: flex;
      flex: 0 0 auto;
      flex-wrap: nowrap;
      align-items: start;
      flex-direction: row;
      justify-items: left;
      justify-content: left;
      max-width: calc(1480px - 24px);
      min-width: calc(20px - 24px);
    }
    .__global_pages_header .__site_info {
      margin: 12px;
      flex: 0 0 auto;
      align-items: center;
      justify-items: center;
      flex-direction: column;
      justify-content: center;
    }
    .__global_pages_header .__site_info .__site_title,
    .__global_pages_header .__site_info .__site_tagline {
      margin: auto;
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      justify-items: center;
      flex-direction: column;
      justify-content: center;
    }
    .__global_pages_header .__site_info .__site_title {
      line-height: 2.645rem;
      font-size: 2.945rem;
      font-weight: bolder;
    }
    .__global_pages_header .__site_info .__site_tagline {
      font-size: 1rem;
      font-weight: 100;
    }


    /* footer style rules */
    .__global_pages_footer .__copyright_text {
      padding: 12px;
      font-style: italic;
      font-size: 0.8rem;
      color: #fff;
    }
  `
})
export class GlobalPagesComponent {

}
