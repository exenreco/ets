import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { CategoryTotal, Expense, ExpensesService, ExpenseWithCategoryName } from '../../../expenses/expenses.service';
import { GoodMorningComponent } from '../../../shared/good-morning/good-morning.component';
import { BarChartComponent } from '../../../shared/bar-chart/bar-chart.component';
import { AuthService } from '../../../security/auth.service';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BarChartComponent,
    GoodMorningComponent
  ],
  providers: [ CurrencyPipe, DatePipe ],
  template: `
    <div class="__page __overview">

      <div class="__grid columns __two_columns">

        <div class="__grid rows __section">
          <div class="__grid rows __widget __gradient whites">
            <app-good-morning [name] ="username"></app-good-morning>
          </div>
          <div class="__grid rows __widget __gradient whites">
            <h2 class="__article_title" style="margin-bottom: 0px;">
              <span>⚡</span> Quick Actions
            </h2><hr>
            <div class="__grid columns __actions_group">
              <ul class="__actions_list">
                <li><a class="__link __has_icon" routerLink="/dashboard/expense-list">
                  <span class="__icon"><i class="fa-solid fa-eye"></i></span>
                  <span class="__title">View all Expense</span>
                </a></li>
                <li><a class="__link __has_icon" routerLink="/dashboard/category-list">
                  <span class="__icon"><i class="fa-solid fa-eye"></i></span>
                  <span class="__title">View all Expense Category</span>
                </a></li>
                <li><a class="__link __has_icon "routerLink="/dashboard/add-expense">
                  <span class="__icon"><i class="fa-solid fa-plus"></i></span>
                  <span class="__title">Add New Expense</span>
                </a></li>
                <li><a class="__link __has_icon" routerLink="/dashboard/add-category">
                  <span class="__icon"><i class="fa-solid fa-plus"></i></span>
                  <span class="__title">Add New Expense Category</span>
                </a></li>
              </ul>

              <ul class="__actions_list">
                <li><a class="__link __has_icon" routerLink="/dashboard/delete-expense">
                  <span class="__icon"><i class="fa-solid fa-trash"></i></span>
                  <span class="__title">Delete an Expense</span>
                </a></li>
                <li><a class="__link __has_icon" routerLink="/dashboard/delete-category">
                  <span class="__icon"><i class="fa-solid fa-trash"></i></span>
                  <span class="__title">Delete an Expense Category</span>
                </a></li>
              </ul>
            </div>
          </div>

          <div class="__grid rows __widget __gradient whites">
            <h2 class="__widget_title">
              <small>Top Expense Category</small>
              as of {{ currentMonth }}
            </h2><hr>
            <app-bar-chart
              [chartData]="categoryTotal"
              [view]="[380, 338]"
              [legend]="false"
              [labels]="showLabels"
              [gradient]="false"
              [showXAxis]="true"
              [showYAxis]="true"
              [roundDomains]="true"
            ></app-bar-chart>
          </div>
        </div>

        <div class="__grid rows __widget __gutter">
          <div class="__grid rows __widget __gradient whites">
            <h2 class="__widget_title">
              <small>Life Time Expenses</small>
              {{ oldestExpenseDate }} - {{ newestExpenseDate }}
            </h2><hr>
            <p class="__widget_title">{{lifetimeExpenses}}</p>
          </div>

          <div class="__grid rows __widget __gradient whites">
            <h2 class="__widget_title">
              <small>{{ currentMonth }} - Expenses</small>
              Total: {{ currentMonthAmount }}
            </h2><hr>
            <app-bar-chart
              [chartData]="currentMonthExpenseData"
              [view]="[380, 380]"
              [legend]="false"
              [labels]="showLabels"
              [gradient]="false"
              [showXAxis]="true"
              [showYAxis]="true"
              [roundDomains]="true"
            ></app-bar-chart>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: `
    .__overview {
      gap: 14px;
      flex-wrap: nowrap;
      margin-bottom: 20em;
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
    .__overview .__grid {
      margin: 0;
    }
    .__overview .__grid.__two_columns {
      align-items: flex-start;
      justify-items: flex-start;
      justify-content: center;
    }
      .__overview .__grid.__two_columns .__gutter {
        gap: 14px;
      }
    .__overview .__section {
      gap: 14px;
      border-radius: .8em;
    }
      .__overview .__section .__widget {
        align-items: flex-start;
        justify-items: flex-start;
        justify-content: center;
      }
    .__actions_group {
      align-items: flex-start;
      justify-items: flex-start;
      justify-content: flex-start;
    }
      .__actions_list {
        margin: 0;
      }
      .__actions_list li {
        width: 100%;
      }
      .__actions_list li .__link {
        gap: 12px;
        margin: 14px;
        display: flex;
        flex: 0 0 auto;
        flex-direction: row;
        align-items: flex-start;
        justify-items: flex-start;
        justify-content: left;
      }
      .__actions_list li .___link .__icon {
        width: 4em;
        height: 4em;
        display: flex;
        flex: 0 0 auto;
        position: relative;
        border-radius: .4em;
        justify-content: center;
      }
  `
})
export class OverviewComponent implements OnInit, OnDestroy {

  // Good morning widget
  username: string = '';


  // Total Expense Widget

  view: [number, number] = [780, 280];

  showLegend: boolean = true;

  showLabels: boolean = true;

  expenses: Expense[] = [];

  totalExpenses: any[] = [];

  // lifetime expenses options
  lifetimeExpenses: string = '';

  oldestExpenseDate: string = '';

  newestExpenseDate: string = '';


  // expenses in the current month
  currentMonthAmount: string = '';

  currentMonthExpense: Expense[] = [];

  currentMonthExpenseData: Array<{name: string; value: number}> = [];

  currentMonth: string = this.datePipe.transform(new Date(),"MMMM, y")!;


  // category totals

  categoryTotal: Array<{name: string; value: number}> = [];

  expensesWithCategoryName: ExpenseWithCategoryName[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private authService:AuthService,
    private currencyPipe: CurrencyPipe,
    private expenseService:ExpensesService,
    private datePipe: DatePipe
  ){}

  ngOnInit(): void {

    // get user expenses
    this.expenseService.getAllExpensesByUserId()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.expenses = res;
        if (this.expenses.length) {
          this.loadTotalExpensesMetrics();
          // create the lifetime amount
          this.lifetimeExpenses = this.calculateExpenseAmount(res);
          // find oldest expense
          this.findNewestExpenseDate();
          // find newest expense
          this.findOldestExpenseDate();
          // find expense belonging to current month
          this.findCurrentMonthExpense();
          //calculate current month total expense
          this.currentMonthAmount =  this.calculateExpenseAmount(this.currentMonthExpense);
        }
      },
      error: (error: any) => {
        console.error(`Error fetching expenses: ${error}`);
      }
    });

    // get user expenses with category name
    this.expenseService.getUserExpensesWithCatName()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.expenses = res;
        if (this.expenses.length) {
          // create category total
          this.categoryTotal = this.findTopExpenseCategory(res);
        }
      },
      error: (error: any) => {
        console.error(`Error fetching expenses: ${error}`);
      }
    });

    // get the current user first name
    this.authService.getFirstName()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ( res: any ) => this.username = ( res && typeof res === 'string' ) ? res : 'user',
      error: (error: any) => console.error(`Error fetching expenses: ${error}`)
    });
  }

  loadTotalExpensesMetrics() {
    this.totalExpenses = this.expenses.map(expense => ({
      name: expense.description || 'N/A',
      value: parseFloat(expense.amount).toFixed(2) || 0  // Ensure numeric values
    }));
  }

  calculateExpenseAmount( collection: Expense[] ) {
    const total = collection.reduce((sum, e) => {
      const n = parseFloat(e.amount);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

    return this.currencyPipe.transform(
      total,
      'USD',
      'symbol',
      '1.2-2'
    )!;
  }

  findOldestExpenseDate() {
    if (!this.expenses || this.expenses.length === 0) {
      this.oldestExpenseDate = '';
      return;
    }

    // Initialize to the first expense’s date
    let oldest = new Date(this.expenses[0].date);

    // Loop through and pick the smallest (earliest) date
    for (const exp of this.expenses) {
      const d = new Date(exp.date);
      if (d < oldest) {
        oldest = d;
      }
    }

    this.oldestExpenseDate = this.datePipe.transform(
      oldest,
      "MMMM y"
    )!;
  }

  findNewestExpenseDate() {
    if (!this.expenses || this.expenses.length === 0) {
      this.newestExpenseDate = '';
      return;
    }

    let newest = new Date(this.expenses[0].date);

    for (const exp of this.expenses) {
      const d = new Date(exp.date);
      if (d > newest) {
        newest = d;
      }
    }

    this.newestExpenseDate = this.datePipe.transform(
      newest,
      "MMMM y"
    )!;
  }

  findCurrentMonthExpense() {
    // Clear both arrays
    this.currentMonthExpense       = [];
    this.currentMonthExpenseData   = [];

    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear  = today.getFullYear();

    for (const exp of this.expenses) {
      const expDate = new Date(exp.date);
      if (isNaN(expDate.getTime())) continue;

      if (expDate.getMonth() === thisMonth
       && expDate.getFullYear() === thisYear) {
        // Push into the raw‐model array
        this.currentMonthExpense.push(exp);

        // Push into the chart‐data array
        this.currentMonthExpenseData.push({
          name:  exp.description,
          value: parseFloat(exp.amount)
        });
      }
    }
  }

  findTopExpenseCategory(newExpense: ExpenseWithCategoryName[]): CategoryTotal[] {
    // Reduce into a map keyed by categoryId
    const totals = newExpense.reduce(
      (acc, exp) => {
        const key = exp.categoryId.toString();
        const amt = parseFloat(exp.amount);
        if (!acc[key]) {
          acc[key] = { name: exp.categoryName || 'N/a', total: 0 };
        }
        acc[key].total += isNaN(amt) ? 0 : amt;
        return acc;
      },
      {} as Record<string, { name: string; total: number }>
    );

    // Convert map -> array, format totals
    const result: CategoryTotal[] = Object.values(totals).map(cat => ({
      name: cat.name,
      value: Number(cat.total.toFixed(2))
    }));

    // Optionally sort descending by value
    result.sort((a, b) => b.value - a.value);

    return result;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
