import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriesService, Category} from '../../categories/categories.service';
import { ExpensesService, Expense, ExpenseWithCategoryName } from '../expenses.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="__page expense-page">

      @if (expenses && expenses.length > 0) {
        <table class="expense-page__table">
          <thead class="expense-page__table-head">
            <tr class="expense-page__table-row">
              <th class="expense-page__table-header">Amount</th>
              <th class="expense-page__table-header">Category</th>
              <th class="expense-page__table-header">Description</th>
              <th class="expense-page__table-header">Date</th>
              <!-- <th class="expense-page__table-header">Action</th> -->

            </tr>
          </thead>
          <tbody class="expense-page__table-body">
            @for (expense of expenses; track expense) {
              <tr class="expense-page__table-row">
                <td class="expense-page__table-cell">{{ expense.amount | currency }}</td>
                <td class="expense-page__table-cell">{{ expense.categoryName}}</td>
                <td class="expense-page__table-cell">{{ expense.description }}</td>
                <td class="expense-page__table-cell">{{ expense.date | date }}</td>
                <!-- <td class="expense-page__table-cell">{{ expense.action }}</td> -->

              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="__grid rows">
          <span>
            There are no Expenses available, try adding some expense!
            <a class="__link" routerLink="/dashboard/add-expense">Add Expense</a>
          </span>
        </div>
      }
    </div>
  `,
  styles: `
    .expense-page__table {
      background-color: #EFF2F7;
      border: 1px solid #C0CCDA;
    }
    .expense-page__table-header {
      text-align: left;
      font-weight: bold;
      padding: 25px 25px 40px 25px;
    }
    .expense-page__table-cell {
      text-align: left;
      padding: 25px 25px 40px 25px;
      border-top: 1px solid #C0CCDA;
      border-bottom: 1px solid #C0CCDA;
    }
    .expense-page__table-body tr:nth-child(even) {
      background-color: #F9FAFC;
    }
    .expense-page__table-body tr:nth-child(odd) {
      background-color: #ffffff;
    }
  `
})
export class ExpenseListComponent {

  errorMessage: string = '';

  expenses: ExpenseWithCategoryName[] = [];

  constructor(private expenseService: ExpensesService){}

  ngOnInit() {
    this.expenseService.getUserExpensesWithCatName().subscribe({
      next: (res => this.expenses = res),
      error: (error) => {
        console.error(`Error fetching expenses: ${error}`);
        this.errorMessage = error.message;
      }
    })
  }
}
