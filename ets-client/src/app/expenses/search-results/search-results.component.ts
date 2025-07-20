import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Expense, ExpensesService } from '../expenses.service';
import { CommonModule } from '@angular/common';
import { filter, map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [ CommonModule ],
  template: `
    <div *ngIf="results.length > 0; else noResults">
      <div *ngFor="let expense of results" class="__grid rows __gradient whites __result">
        <h2 class="__widget_title">
          {{expense.description}}
          <small>Expense ID: #{{expense.expenseId}}</small>
        </h2><hr>
        <div class="about">
          <div><b>Amount:</b> \${{ expense.amount }}</div>
          <div><b>Category Id:</b> #{{ expense.categoryId }}</div>
          <div><b>Date Created:</b> {{ expense.dateCreated }}</div>
        </div>
      </div>
    </div>
    <ng-template #noResults>
      <div id="__no_result" class="__grid rows __result">
        <h2 class="__widget_title">
          404 Error.
          <small>There were no result matching your search...</small>
        </h2>
      </div>
    </ng-template>
  `,
  styles: `
    b { font-weight: bolder; }
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
    .about {
      width: 100%;
      display: flex;
      flex: 0 0  auto;
      flex-direction: column;
    }
    .about > div {
      margin-bottom: 12px;
    }
  `
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  results: Expense[] = [];

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map(m => m.get('q')!),                              // grab the q string
        map(q => JSON.parse(decodeURIComponent(q))),        // back to your filter object
        switchMap(filters => this.expensesService.searchExpenses(filters)),
        takeUntil(this.destroy$)
      )
      .subscribe(data => (this.results = data));;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
