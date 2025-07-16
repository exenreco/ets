import { DatePipe } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { Component, Input, OnInit, OnChanges, OnDestroy} from '@angular/core';


@Component({
  selector: 'app-good-morning',
  standalone: true,
  imports: [],
  providers: [DatePipe],
  template: `
    <div class="__widget __good_morning">
      <h2 class="__article_title" style="margin-bottom: 0px;">
        {{ greeting }} {{ formattedName }}! {{ greetingEmoji }}
      </h2><hr>
      <p class="__article_text" style="text-indent: 0;">
        Ready to manage your expenses? Financial freedom is ultimate!<br>
        {{ formattedDate }}
      </p>
    </div>
  `,
  styles: `
    .__good_morning {
      margin: 0;
      width: 100%;
      display: block;
      position: relative;
    }
  `
})
export class GoodMorningComponent implements OnInit, OnChanges, OnDestroy {

  @Input() name: string = '';

  private timerSub!: Subscription;

  private now: Date = new Date();

  greeting: string = '';

  greetingEmoji: string = '';

  formattedDate: string = '';

  formattedName: string = '';

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.formattedName = this.capitalize(this.name);

    // fire immediately, and then every 1 second
    this.timerSub = interval(1000).subscribe(() => {
      this.now = new Date();
      this.updateDisplay();
    });
  }

  ngOnChanges() {
    this.formattedName = this.capitalize(this.name);
  }

  ngOnDestroy() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  private updateDisplay() {
    // format date
    this.formattedDate = this.datePipe.transform(
      this.now,
      "EEEE, MMMM d, y 'at' hh:mm:ss a"
    )!;

    // pick greeting
    const hour = this.now.getHours();
    if (hour < 12) {
      this.greeting = 'Good Morning'; this.greetingEmoji = '🌞';
    } else if (hour < 18) {
      this.greeting = 'Good Afternoon'; this.greetingEmoji = '☀️';
    } else {
      this.greeting = 'Good Night'; this.greetingEmoji = '🌙';
    }
  }

  private capitalize(str: string) {
    return str
      ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
      : '';
  }
}
