import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpensesService, ExpenseWithCategoryName } from '../expenses.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-delete-expense',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <p>Delete Expense component works!</p>
  `,
  styles: ``
})
export class DeleteExpenseComponent {

}
