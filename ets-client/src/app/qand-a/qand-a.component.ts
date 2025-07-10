import { Component } from '@angular/core';

@Component({
  selector: 'app-qand-a',
  standalone: true,
  imports: [],
  template: `
   <div class="__pages __qNa">
      <div class="container">
        <ol class="__qNa-list">
          <li class="item">
            <span class="__question"> Hello world how are you?</span>
            <span class="__response">
              <b>Respnse:</b> Greate thank you!
            </span>
          </li>
          <li class="item">
            <span class="__question"> Hello world how are you?</span>
            <span class="__response">
              <b>Respnse:</b> Greate thank you!
            </span>
          </li>
        </ol>
      </div>
   </div>
  `,
  styles: `
    .__qNa-list {
      display: block;
      margin: auto;
      list-style-type: decimal;
    }
    .__qNa-list .item {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      margin-bottom: 2em;
    }
    .__qNa-list .item .__question {
      margin-bottom: 2em;
    }
    .__qNa-list .item .__response {
      display: block;
      margin: 0;
      position: relative;
      padding-left: 1.5em;
      width: calc(100% - 1.5em);
    }
    .__qNa-list .item .__response b {
      font-weight: bolder;
    }
  `
})
export class QandAComponent {}
