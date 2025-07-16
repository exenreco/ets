import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="chart-container">
      <ng-container *ngIf="processedData.length > 0; else loading">
        <ngx-charts-bar-vertical
          [view]="view"
          [results]="processedData"
          [scheme]="colorScheme"
          [gradient]="gradient"
          [xAxis]="showXAxis"
          [yAxis]="showYAxis"
          [legend]="legend"
          [showDataLabel]="labels"
          [roundDomains]="roundDomains"
          [yScaleMin]="yScaleMin"
          [tooltipText]="tooltipText"
        >
        </ngx-charts-bar-vertical>
      </ng-container>
      <ng-template #loading>
        <p class="__article_text">Loading user data...</p>
      </ng-template>
    </div>
  `,
  styles: `
    .chart-container {
      width: 100%;
      display: block;
    }
    .tooltip-label {
      font-weight: bold;
    }
    .tooltip-val {
      display: block;
      margin-top: 4px;
    }
  `
})
export class BarChartComponent implements OnChanges {

  @Input() chartData: Array<{ name: string; value: number }> = [];

  @Input() legend = true;

  @Input() labels = true;

  @Input() gradient = false;

  @Input() showXAxis = true;

  @Input() showYAxis = true;

  @Input() roundDomains = false;

  @Input() yScaleMin: number = 0;

  @Input() view: [number, number] = [700, 400];

  @Input() colorScheme: Color = {
    name: 'cool',
    group: ScaleType.Linear,
    domain: ['#880D1E', '#DD2D4A', '#F26A8D', '#F49CBB'],
    selectable: true,
  };

  processedData: Array<{ name: string; value: number; percentage: number }> = [];
  private cdr = inject(ChangeDetectorRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      this.processData();
    }
  }

  private processData(): void {
    if (!this.chartData || this.chartData.length === 0) {
      this.processedData = [];
      return;
    }

    const total = this.chartData.reduce((sum, item) => sum + item.value, 0);
    this.processedData = this.chartData.map(item => ({
      ...item,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
    }));

    // trigger change‑detection so ngx‑charts picks up new data
    this.cdr.detectChanges();
  }

  tooltipText({ data }: { data: any }): string {
    return `
      <span class="tooltip-label">${data.name}</span>
      <span class="tooltip-val">
        ${data.value} (${data.percentage}%)
      </span>
    `;
  }
}
