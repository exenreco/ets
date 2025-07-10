import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../security/auth.service';
import { Router, RouterLink, RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';

/**
 * DashboardComponent
 *
 * Handles all authenticated pages
 *
 * @component Dashboard
 *
 * @dev Team Athene: Exenreco Bell, Sara Gorge
 */

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <main class="__dashboard">

      <nav class="__dashboard_menu" [class.active]="submenuStates['menu']">
        <section class="__menu_info">
          <h1 class="__title">Athena's</h1>
          <p class="__tagline">Expense Tracking System</p>
        </section>
        <ul class="__menu_nav">
          <li class="__nav_item">
            <a class="__link __toggle" style="font-weight:bolder;" routerLink="/dashboard/overview">
              <span class="__icon"><i class="fa-solid fa-chart-simple"></i></span>
              <span class="__title">Overview</span>
            </a>
          </li>
          <li class="__nav_item" [class.active]="submenuStates['expenses']">
            <span class="__toggle" (click)="toggleSubmenu('expenses')">
              <span class="__icon"><i class="fa-solid fa-sack-dollar"></i></span>
              <span class="__title">Expenses</span>
            </span>
            <ul class="__submenu">
              <li class="__submenu_item">
                <a class="__link" routerLink="/dashboard/expense-list">All Expenses</a>
              </li>
              <li class="__submenu_item">
                <a class="__link" routerLink="/dashboard/add-expense">Add Expense</a>
              </li>
              <li class="__submenu_item">
                <a class="__link" routerLink="/dashboard/update-expense">Update Expense</a>
              </li>
              <li class="__submenu_item">
                <a class="__link" href="#">Delete Expense</a>
              </li>
            </ul>
          </li>
          <li class="__nav_item" [class.active]="submenuStates['categories']">
            <span class="__toggle" (click)="toggleSubmenu('categories')">
              <span class="__icon"><i class="fa-solid fa-list"></i></span>
              <span class="__title">Categories</span>
            </span>
            <ul class="__submenu">
              <li class="__submenu_item">
                <a class="__link" href="#">All Categories</a>
              </li>
              <li class="__submenu_item">
                <a class="__link" href="#">Add Category</a>
              </li>
              <li class="__submenu_item">
                <a class="__link" href="#">Update Category</a>
              </li>
              <li class="__submenu_item">
                <a class="__link" href="#">Delete Category</a>
              </li>
            </ul>
          </li>
          <li class="__nav_item">
            <a class="__link __toggle" routerLink="/dashboard/q-and-a" style="font-weight:bolder;">
              <span class="__icon"><i class="fa-solid fa-clipboard-question"></i></span>
              <span class="__title">Question & Answers</span>
            </a>
          </li>
        </ul>
        <footer class="__menu_footer">
          <button class="__button tertiary" title="Logout" type="button" (click)="onLogout()">
            <span class="__icon"><i class="fa-solid fa-right-from-bracket"></i></span>
            <span class="__title">Logout</span>
          </button>
        </footer>
      </nav>

      <article class="__dashboard_content">

        <header class="__dashboard_header">
          <span
            id="__nav_toggle"
            class="__nav_toggle"
            (click)="toggleSubmenu('menu')"
            [class.active]="submenuStates['menu']"
          >
            <div class="nav-line"></div>
            <div class="nav-line"></div>
            <div class="nav-line"></div>
          </span>

          <div class="__page_title">{{ pageTitle }}</div>

          <div class="__profile">
            <div class="__account_menu_toggle" [class.active]="submenuStates['account']">
              <span
                (click)="toggleSubmenu('account')"
                class="__initial"
              >{{ userInitial }}</span>
              <span
                (click)="toggleSubmenu('account')"
                class="__indicator"
              >&#9698;</span>
            </div>
            <ul class="__user_menu">
              <li class="__menu_item">
                <a class="__link" href="#" title="Financial Advisor">
                  <span class="__icon"><i class="fa-solid fa-headset"></i></span>
                  <span class="__title">Financial Advisor</span>
                </a>
              </li>
              <li class="__menu_item">
                <a class="__link" href="#" title="Account Settings">
                  <span class="__icon"><i class="fa-solid fa-gear"></i></span>
                  <span class="__title">Account Settings</span>
                </a>
              </li>
              <li class="__menu_item">
                <a class="__link" title="Logout" (click)="onLogout()">
                  <span class="__icon"><i class="fa-solid fa-right-from-bracket"></i></span>
                  <span class="__title">Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </header>

        <main class="__dashboard_main">
          <router-outlet></router-outlet>
        </main>
        <footer class="__dashboard_footer">
          <p class="__small">Athena's Expense Tracking System</p>
        </footer>
      </article>

    </main>
  `,
  styles: `
    /** { outline: 1px solid purple;}*/
    .__dashboard {
      width: 100vw;
      height: 100wh;
      display: flex;
      flex: 0 0 auto;
      max-width: 100vw;
      min-width: 100vw;
      max-height: 100wh;
      min-height: 100wh;
      position: relative;
      flex-direction: row;
    }
    .__dashboard .__dashboard_menu {
      top: 0;
      left: 0;
      z-index: 1;
      width: 20em;
      height: 100%;
      display: none;
      position: fixed;
      color: #ffffff;
      visibility: hidden;
      background: var(--primary-color, #880D1E);
      border-right: .2em solid rgb(223, 223, 223);
    }
      .__dashboard .__dashboard_menu .__menu_info,
      .__dashboard .__dashboard_menu .__menu_nav,
      .__dashboard .__dashboard_menu .__menu_footer {
        width: 20em;
        margin-bottom: 18px;
      }
      .__dashboard .__dashboard_menu .__menu_info {
        z-index: 2;
        padding: 12px;
        display: flex;
        flex: 0 0 auto;
        position: relative;
        align-items: center;
        justify-items: center;
        flex-direction: column;
        justify-content: center;
        width: calc(20em - 24px);
        height: calc(4.45em - 24px);
        border-bottom: .2em solid var(--secondary-color, #DD2D4A);
      }
        .__dashboard .__dashboard_menu .__menu_info .__title,
        .__dashboard .__dashboard_menu .__menu_info .__tagline {
          width: 90%;
          margin: auto;
          display: flex;
          flex: 0 0 auto;
          text-align: left;
          align-items: left;
          flex-direction: row;
          justify-items: flex-start;
          justify-content: flex-start;
        }
        .__dashboard .__dashboard_menu .__menu_info .__title {
          line-height: 2.445rem;
          font-size: 2.445rem;
          font-weight: bolder;
        }
        .__dashboard .__dashboard_menu .__menu_info .__tagline {
          font-size: .825rem;
          font-weight: 100;
        }

      .__dashboard .__dashboard_menu .__menu_nav {
        padding: 0;
        margin-top: 2em;
        font-weight: bolder;
      }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item {
          width: 90%;
          margin: auto auto 20px auto;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item a,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item a:link,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item a:active,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item a:visited,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item .__link,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item .__link:link,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item .__link:active,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item .__link:visited {
          color: #ffffff;
          font-weight: normal;
          text-decoration: none;
          transition: all 400ms ease-in-out;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item a:hover,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item .__link:hover,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item:has(.__submenu) .__toggle:hover {
          color: var(--secondary-color, #DD2D4A);
          transition: all 400ms ease-in-out;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item .__toggle {
          gap: 10px;
          display: flex;
          flex: 0 0 auto;
          cursor: pointer;
          flex-direction: row;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item:has(.__submenu) .__toggle:after {
          width: 18px;
          right: 17px;
          height: 17px;
          display: flex;
          flex: 0 0 auto;
          content: "\\25E2";
          font-weight: 900;
          position: absolute;
          border-radius: .2em;
          align-items: center;
          background: var(--secondary-color, #DD2D4A);
          justify-items: center;
          justify-content: center;
          font-family: "Font Awesome 6 Free";
          color: #ffffff;
          transition: all 400ms ease-in-out;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item:not(.active) .__submenu {
          display: none;
          visibility: hidden;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item:has(.active) .__submenu {
          display: flex;
          visibility: visible;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item:not(.active) .__toggle:after {
          transform: rotate(180deg);
          transition: all 400ms ease-in-out;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item:has(.active) .__toggle:after {
          transform: rotate(0deg);
          transition: all 400ms ease-in-out;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item .__submenu {
          width: 82%;
          margin: auto;
        }
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item .__submenu li,
        .__dashboard .__dashboard_menu .__menu_nav .__nav_item .__submenu .__submenu_item {
          margin: 12px auto 12px auto;
        }

      .__dashboard .__dashboard_menu .__menu_footer {
        z-index: 1;
        width: 20em;
        bottom: 0px;
        display: flex;
        flex: 0 0 auto;
        margin-bottom: 0;
        text-align: center;
        position: absolute;
        align-items: center;
        justify-items: center;
        justify-content: center;
      }
      .__dashboard .__dashboard_menu .__menu_footer .__link,
      .__dashboard .__dashboard_menu .__menu_footer .__button {
        gap: 12px;
        width: 95%;
        margin: 5px;
        display: flex;
        flex: 0 0 auto;
        flex-direction: row;
        align-items: center;
        justify-items: center;
        justify-content: center;
      }
      .__dashboard .__dashboard_menu .__menu_footer,
      .__dashboard .__dashboard_menu .__menu_footer a,
      .__dashboard .__dashboard_menu .__menu_footer a:link,
      .__dashboard .__dashboard_menu .__menu_footer a:active,
      .__dashboard .__dashboard_menu .__menu_footer a:visited,
      .__dashboard .__dashboard_menu .__menu_footer .__link,
      .__dashboard .__dashboard_menu .__menu_footer .__link:link,
      .__dashboard .__dashboard_menu .__menu_footer .__link:active,
      .__dashboard .__dashboard_menu .__menu_footer .__link:visited,
      .__dashboard .__dashboard_menu .__menu_footer .__button {
        color: #ffffff;
        font-weight: bolder;
        text-decoration: none;
        transition: all 400ms ease-in-out;
      }
      .__dashboard .__dashboard_menu .__menu_footer a:hover,
      .__dashboard .__dashboard_menu .__menu_footer .__link:hover {
        color: var(--secondary-color, #DD2D4A);
        transition: all 400ms ease-in-out;
      }
      .__dashboard .__dashboard_menu .__menu_footer .__button:hover {
        color: #ffffff;
        transition: all 400ms ease-in-out;
      }

      /*NAV: toggle */
      .__dashboard .__dashboard_menu.active {
        display: flex;
        visibility: visible;
        flex-direction: column;
        align-items: flex-start;
        justify-items: flex-start;
        justify-content: flex-start;
      }
      .__dashboard:has(.__dashboard_menu:not(.active)) .__dashboard_content {
        width: 100%;
        left: initial;
        max-width: 100%;
        min-width: 100%;
        margin: auto auto auto auto;
      }
      .__dashboard:has(.__dashboard_menu:not(.active)) .__dashboard_header {
        width: calc(100% - 24px);
      }
      .__dashboard:has(.__dashboard_menu:not(.active)) .__dashboard_footer {
        left: initial;
        width: calc(100% - 24px);
      }

    .__dashboard .__dashboard_content {
      left: 0em;
      padding: 0;
      z-index: 1;
      height: 100vh;
      display: flex;
      position: fixed;
      margin-left: 20em;
      max-height: 100vh;
      min-height: 100vh;
      align-items: start;
      justify-items: start;
      justify-content: left;
      flex-direction: column;
      width: calc(100% - 20em);
      max-width: calc(100% - 20em);
      min-width: calc(100% - 20em);
    }
      .__dashboard_header {
        gap: 12px;
        z-index: 2;
        padding: 12px;
        display: flex;
        flex: 0 0 auto;
        position: fixed;
        color: #343a40;
        flex-direction: row;
        align-items: center;
        justify-items: center;
        justify-content: center;
        background-color: #ffffff;
        height: calc(4.45em - 24px);
        width: calc(100% - calc(20em + 24px));
        border-bottom: .2em solid rgb(223, 223, 223);
      }
        /* Dashboard Header nav toggle */
        .__nav_toggle {
          gap: 4px;
          width: 28px;
          height: 24px;
          padding: 5px;
          z-index: 1000;
          display: flex;
          cursor: pointer;
          border-radius: 5px;
          position: relative;
          align-items: center;
          justify-items: center;
          flex-direction: column;
          justify-content: center;
          backdrop-filter: blur(10px);
          background: hwb(0 100% 0% / 0.1);
          box-shadow: 0 4px 6px #0000001a;
        }
        .__nav_toggle .nav-line {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          transform-origin: center;
          background-color: #555555;
          transition: all 0.4s ease-in-out;
        }
        .__nav_toggle.active .nav-line {
          background-color: var(--primary-color, #880D1E);
        }
        .__nav_toggle.active .nav-line:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }
        .__nav_toggle.active .nav-line:nth-child(2) {
          opacity: 0;
        }
        .__nav_toggle.active .nav-line:nth-child(3) {
          transform: rotate(-45deg) translate(3.88px, -4px);
        }

        /* Dashboard Header nav profile */
        .__profile {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          justify-items: center;
          flex-direction: column;
          justify-content: center;
        }
          .__profile .__account_menu_toggle {
            gap: 8px;
            width: 82px;
            display: flex;
            flex-wrap: nowrap;
            flex-direction: row;
            align-items: center;
            justify-items: center;
            justify-content: right;
          }
          .__profile .__account_menu_toggle .__initial,
          .__profile .__account_menu_toggle .__indicator {
            width: auto;
            height: auto;
            cursor: pointer;
          }
          .__profile .__account_menu_toggle .__initial {
            color: #fff;
            height: 50px;
            display: flex;
            line-height: 0;
            flex-wrap: nowrap;
            text-align: center;
            font-size: 2.845rem;
            flex-direction: row;
            border-radius: 100%;
            align-items: center;
            font-weight: bolder;
            justify-items: center;
            justify-content: center;
            width: calc(62px - 12px);
            background: var(--primary-color-shade, #F26A8D);
            border: .124em solid var(--primary-color-shade, #F26A8D);
          }
          .__profile .__account_menu_toggle .__indicator {
            color: #555;
            width: 12px;
            height: 58px;
            display: flex;
            flex: 0 0 auto;
            align-items: flex-end;
            justify-content: flex-end;
          }
          .__profile:has(.__account_menu_toggle:not(.active)) .__user_menu {
            display: none;
            visibility: hidden;
          }
          .__profile:has(.__account_menu_toggle.active) .__user_menu {
            gap: 12px;
            top: 100%;
            right: 0px;
            padding: 12px;
            display: flex;
            color: #fff;
            cursor: pointer;
            position: absolute;
            visibility: visible;
            flex-direction: column;
            box-shadow: 0px 1px 4px 4px rgba(0, 0, 0, .4);
            background: var(--secondary-color, #DD2D4A);
          }
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item,
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item .__link {
            gap: 12px;
            display: flex;
            flex: 0 0 auto;
            flex-direction: row;
            text-decoration: none;
          }
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item,
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item .__link,
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item .__link:link,
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item .__link:active,
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item .__link:visited {
            color: #fff;
            transition: all 400ms ease-in-out;
          }
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item:hover,
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item .__link:hover {
            color: var(--secondary-color-shade, #F49CBB);
            transition: all 400ms ease-in-out;
          }

          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item .__icon,
          .__profile:has(.__account_menu_toggle.active) .__user_menu .__menu_item .__title {
            display: inline-block;
          }
          .__profile:has(.__account_menu_toggle.active) .__user_menu li .__icon {
            width: 14px;
          }
          .__profile:has(.__account_menu_toggle.active) .__user_menu li .__title {
            width: calc(100% - 14px);
          }

        /* Dashboard Header page title */
        .__page_title {
          color: #555555;
          display: flex;
          font-size: 1.5em;
          font-weight: bold;
          width: calc( 100% - 28px - 82px);
        }

      .__dashboard_main {
        z-index: 1;
        width: 100%;
        margin: auto;
        padding: 12px;
        display: block;
        overflow-y: auto;
        position: relative;
        margin-top: 4.45em;
        background: #F5F5F5;
        color:rgb(78, 76, 76);
        max-width: calc(100% - 24px);
        min-width: calc(100% - 24px);
        height: calc(100vh - calc(4.45em + 2.45em + 24px));
        max-height: calc(100vh - calc(4.45em + 2.45em + 24px));
        min-height: calc(100vh - calc(4.45em + 2.45em + 24px));
      }
      .__dashboard_footer {
        bottom: 0;
        left: 20em;
        z-index: 1;
        padding: 12px;
        color:rgb(187, 184, 184);
        position: fixed;
        text-align: right;
        font-style: italic;
        height: calc(2.45em - 24px);
        width: calc(100% - calc(20em + 24px));
        border-top: .2em solid rgb(223, 223, 223);
        background: var(--background-color, rgb(222, 232, 247));
      }
        .__small {
          font-size: .825rem;
        }

    /* Media Queries Mobile */
    @media screen and (max-width: 800px) {
      .__dashboard:has(.__nav_toggle.active) .__dashboard_menu,
      .__dashboard:has(.__nav_toggle.active) .__dashboard_menu.active {
        z-index: 10;
      }
      .__dashboard:has(.__nav_toggle.active) .__dashboard_content:after {
        top: 0;
        left: 20em;
        right: 0;
        bottom: 0;
        z-index: 1;
        content: "";
        width: 100vw;
        height: 100vh;
        display: block;
        position: fixed;
        overflow-x: hidden;
        overflow-y: hidden;
        backdrop-filter: blur(25px); /* Apply blur effect */
        -webkit-backdrop-filter: blur(35px); /* For Safari compatibility */
      }

      .__dashboard:has(.__dashboard_menu.active) .__nav_toggle,
      .__dashboard:has(.__dashboard_menu.active) .__nav_toggle.active {
        top: 12px;
        right: 12px;
        z-index: 999;
        position: fixed !important;
      }
      .__dashboard:has(.__dashboard_menu.active) .__page_title,
      .__dashboard:has(.__dashboard_menu.active) .__profile {
        display: none;
        visibility: hidden;
      }
      .__dashboard:has(.__dashboard_menu.active) .__dashboard_header {
        background: transparent;
      }

    }
  `
})
export class DashboardComponent implements OnInit {

  userInitial: string = 'U';

  pageTitle: string = 'Dashboard';

  // Track menu, submenu and account states individually
  submenuStates: { [key: string]: boolean } = {
    menu: true,
    account: false,
    expenses: true,
    categories: true
  };

  constructor(

    private router: Router,

    private titleService: Title,

    private authService: AuthService,

    private cookieService: CookieService,

    private activatedRoute: ActivatedRoute,

  ) {}

  ngOnInit(): void {

    this.updateTitle(); // set initial title

    this.updateUserInitial(); // update initial

    // Title service sub subscription: update on route change
    this.router.events.pipe(

      filter(event => event instanceof NavigationEnd)

    ).subscribe(() =>{ this.updateTitle(); });

  }

  // Update Dashboard title based on the activated routed
  private updateTitle(): void {

    let route = this.activatedRoute;

    while (route.firstChild) route = route.firstChild;

    route.data.subscribe(data => {

      this.pageTitle = data['title'] || 'Dashboard'; // update component

      this.titleService.setTitle(`${this.pageTitle} | AETs`); // update browser tab
    });

  }

  // update the user profile initial
  updateUserInitial(): void {

    if( this.authService.getUserName() ) {

      const username = this.authService.getUserName();

      this.userInitial = username?.[0]?.toUpperCase() ?? 'U';

    }
  }

  // Toggle specific submenu
  toggleSubmenu(menuKey: string): void {

    this.submenuStates[menuKey] = !this.submenuStates[menuKey];

  }

  // Logout user account
  onLogout(): void {
    // Remove all session cookie manual incase logout fails
    this.cookieService.delete('sessionUser');
    this.cookieService.delete('sessionUserId');
    this.cookieService.delete('sessionUserName');
    this.cookieService.deleteAll();
    this.authService.logout();
  }
}
