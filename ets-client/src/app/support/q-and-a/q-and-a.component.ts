import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-q-and-a',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="__pages __qNa">
      <div class="__container">
        <ol class="__list">
          <li class="item">
            <span class="__question">
              <b>Question:</b> What is the purpose of the Athena's Expense Tracking System?
            </span>
            <span class="__response">
              <b>Response:</b><hr><p>AETs is designed to help users monitor
                and categorize their daily expenditures. It provides tools for
                creating, viewing, updating, and deleting expenses and categories,
                enabling users to make informed financial decisions and reduce financial
                stress.
              </p>
            </span>
          </li>
          <li class="item">
            <span class="__question">
              <b>Question:</b> What features does the Athena's Expense Tracking System offers?
            </span>
            <span class="__response">
              <b>Response:</b><hr><p>The system offers features such as:</p>
                <ul class="__list __text">
                  <li>Expense CRUD (Create, Read, Update, Delete) operations</li>
                  <li>Category creation and management</li>
                  <li>Search and filter functionality for expenses</li>
                  <li>A centralized dashboard with key metrics and insights</li>
                  <li>Secure user authentication and data access</li>
                </ul>
            </span>
          </li>
          <li class="item">
            <span class="__question">
              <b>Question:</b> How does the system ensure data security?
            </span>
            <span class="__response">
              <b>Response:</b><hr><p>The system uses JWT (JSON Web Token) authentication to restrict
              data access. This ensures that only authorized users can access and manage their
              own data. Additionally, sensitive information like passwords is securely hashed
              before storage.</p>
            </span>
          </li>
          <li class="item">
            <span class="__question">
              <b>Question:</b> Can I create custom categories for my expenses?
            </span>
            <span class="__response">
              <b>Response:</b><hr><p>Yes, users can create custom categories to organize their
              expenses. Each category is unique to the user and can be used to group related
              expenses for better financial tracking.</p>
            </span>
          </li>
          <li class="item">
            <span class="__question">
              <b>Question:</b> How does the dashboard help users?
            </span>
            <span class="__response">
              <b>Response:</b><hr><p>The dashboard provides a centralized view of key metrics,
              such as recent expenses, category breakdowns, and spending trends. It allows
              users to quickly access and manage their expenses and categories.</p>
            </span>
          </li>
        </ol>
      </div>
      <div class="__contact_link">
        <article class="__article_text">Still have Questions?</article>
        <button
          type="button"
          class="__link __button primary"
          routerLink="/dashboard/contact"
        >
          <span class="__title">Contact Us</span>
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
   </div>
  `,
  styles: `
    .__qNa .__container {
      gap: 2px;
      margin: auto;
      padding: 12px;
      display: flex;
      flex: 0 0 auto;
      flex-wrap: nowrap;
      flex-direction: row;
      align-items: left;
      justify-items: left;
      justify-content: center;
      height: calc(100% - 24px);
      width: calc(100% - 24px);
    }
    .__qNa .__container:before {
      top: 38px;
      left: 24px;
      margin: 0;
      width: 1px;
      content: '';
      padding: 2px;
      margin: auto;
      display: block;
      position: absolute;
      border-radius: .5em;
      height: calc(100% - 24px);
      background: var(--primary-color-shade, #F26A8D);
    }
      .__qNa .__container .__list {
        display: block;
        padding: 12px;
        list-style-type: disc;
        width: calc(100% - 29px);
      }
        .__list .item {
          padding: 12px;
          display: flex;
          flex: 0 0 auto;
          margin-bottom: 1.9425em;
          flex-direction: column;
          width: calc( 100% - 24px);
          border-radius: .4em;
        }
        .__list .item:before {
          left: 18px;
          content: "";
          width: 10px;
          height: 10px;
          background: #fff;
          position: absolute;
          border-radius: 100%;
          border: .2em solid var(--secondary-color, #DD2D4A);
        }
          .__list .item:nth-child(odd) {
            background-color: rgba(203, 238, 243, 0.4);
          }
          .__list .item:nth-child(even) {
            background-color: rgba(244, 156, 187, 0.2);
          }
            .__list .item .__question {
              margin-bottom: 0.5em;
            }
            .__list .item .__response {
              margin: auto;
              display: block;
              position: relative;
              padding-left: .2em;
              width: calc(100% - .2em - 18px);
            }
              .__list .item .__response b:before {
                width: 12px;
                height: 12px;
                padding: 8px;
                display: block;
                font-weight: 900;
                content: '\\f3e5';
                display: inline-block;
                transform: rotate(-180deg) !important;
                font-family: "Font Awesome 6 Free";
              }
              .__list .item .__response b,
              .__list .item .__question b {
                font-weight: bolder;
                display: inline-block;
              }
              .__list .item ul,
              .__list .item p {
                color: rgb(116, 114, 114);
                margin: auto;
                text-indent: 0px;
                line-height: 1.452rem;
                width: 90% !important;
              }
              .__list .item p {
                width: 95% !important;
              }
    .__contact_link {
      color: #fff;
      height: 4em;
      padding: 12px;
      display: flex;
      flex: 0 0 auto;
      margin: auto;
      margin-top: 12px;
      flex-wrap: nowrap;
      border-radius: .4em;
      flex-direction: row;
      align-items: center;
      justify-items: center;
      justify-content: center;
      width: calc(95% - 24px);
      background: var(--primary-color-shade, #F26A8D);
    }
      .__contact_link .__button,
      .__contact_link .__article_text {
        margin: auto;
      }
      .__contact_link .__button {
        width: 180px;
      }
      .__contact_link .__button .__title {
        margin: .2em;
        font-weight: bolder;
        text-transform: uppercase;
      }
      .__contact_link .__article_text {
        color: #fff;
        padding: 0px;
        width: calc(88% - 180px);
        text-indent: 0px !important;
      }
  `
})
export class QAndAComponent {

}
