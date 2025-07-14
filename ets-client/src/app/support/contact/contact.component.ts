import { Component } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FormsModule }      from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  template: `
    <div class="__page __contact">
      <div class="__container">
        <form class="__form __messaging">

          <div class="__form_group">
            <label>To:</label>
            <input type="text" value="spport@aets.com" disabled>
          </div>

          <div class="__form_group">
            <label>From:</label>
            <input type="text" value="user@aets.com" disabled>
          </div>

          <div class="__form_group">
            <label>Subject:</label>
            <input type="text" value="" placeholder="What issues are you facing?">
          </div>

          <div class="__form_group">
            <label>Message:</label>
            <quill-editor
              [(ngModel)]="message"
              name="message"
              placeholder="A little more about your issue..."
              style="height: 400px;"
            ></quill-editor>
          </div>

          <div class="__form_action">
            <input
              type="submit"
              class="__button primary"
              value="Send Message"
            >
          </div>

        </form>
      </div>
    </div>
  `,
  styles: `
    .__messaging label {
      font-weight: bolder;
    }
    .__form_action {
      padding: 12px;
      display: flex;
      flex: 0 0 auto;
      margin-top: 4em;
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
  `
})
export class ContactComponent {
  to: string = "support@aets.com";

  from: string = "user@eample.com";

  message: string = '';

  send() {
    console.log('subject, to, message ->', this.message);
  }
}
