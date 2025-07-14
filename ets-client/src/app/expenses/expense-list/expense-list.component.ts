import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpensesService, ExpenseWithCategoryName } from '../expenses.service';

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
            <span class="expense-page__no-expenses">There are no Expenses available, try adding some expense!</span>
            <a class="__link" routerLink="/dashboard/add-expense"> Add Expense</a>
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
export class ExpenseListComponent implements OnInit {

  errorMessage: string = '';

  expenses: ExpenseWithCategoryName[] = [];

  constructor(private expenseService: ExpensesService){}

  ngOnInit() {
    this.expenseService.getUserExpensesWithCatName().subscribe({
      next: (res => this.expenses = res),
      error: (error: any) => {
        if( error && error.message ) this.errorMessage = error.message;
        console.error(`Error fetching expenses: ${error}`);
      }
    })
  }
}
