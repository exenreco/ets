import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Expenses } from '../expenses';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="__page expense-page">

      <!-- displays a table with the data retrieved from the database -->
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
      <!-- Displays a message if there is no data to display -->
      } @else {
        <p class="expense-page__no-expenses">No expenses found.</p>
      }
    </div>
  `,
  styles: `
    .expense-page__table {
      background-color: #EFF2F7;
      border: 1px solid #C0CCDA;
    }
    .expense-page__table-header {
      padding: 25px 25px 40px 25px;
      font-weight: bold;
    }
    .expense-page__table-cell {
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
  expenses: Expenses[] = [];
  errorMessage: string = '';

  // Fetch expenses with category information to display the categoryId from the expenses collection as the corresponding category name from the category collection in the table
  ngOnInit() {
    this.expensesService.getExpensesWithCategory().subscribe(data => {
      this.expenses = data;
    });
  }

  // Constructor to fetch expenses from the service in order to display them in the table
  constructor(private expensesService: ExpensesService) {
    this.expensesService.getExpenses().subscribe({
      next: (expenses: Expenses[]) => {
        this.expenses = expenses;
        console.log('Expenses: ${JSON.stringify(this.expenses)}`);');
      },

      error: (error: any) => {
        console.error('Error fetching expenses: ${err}');
        this.errorMessage = error.message;
      }
    });
  }
}
