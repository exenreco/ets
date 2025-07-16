import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpensesService, ExpenseWithCategoryName } from '../expenses.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-by-id',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="__page __expenseById">
      <div class="__grid columns form_container">
        <form [formGroup]="expenseForm" class="form_container" (ngSubmit)="onSubmit()">

         @if( userExpenses && userExpenses.length >= 1 ){
          <div class="__form_group">
            <label for="expenseSelect">Select Expense ID:</label>
            <select id="expenseSelect" formControlName="selectedExpenseId" >
              <option value="">-- Select an expense ID --</option>
              <option *ngFor="let expense of userExpenses" [value]="expense.expenseId">
                ID: {{expense.expenseId}} - {{ expense.description }}
              </option>
            </select>
          </div>
          <div class="__form_action">
            <input type="submit" class="__button tertiary" value="View Expense Details" />
          </div>
         } @else {
           <div class="__grid rows no-expense">
              <span>
                There is nothing to update, try adding some expenses!
                <a class="__link" routerLink="/dashboard/add-expense">Add Expense</a>
              </span>
            </div>
          }
          @if( selectedExpenseData ) {
            <table *ngIf="selectedExpenseData" class="expense-page__table">
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
                @for (expense of [selectedExpenseData]; track expense) {
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
            <div class="__grid rows no-expense">
              <span>
                Please select an expense to view details.
              </span>
            </div>
          }
        </form>
      </div>
    </div>
  `,
  styles: `
    .form_container {
      margin: 0;
      align-items: start;
      justify-content: start;
    }
    .form_container form {
      margin: 0;
      align-items: center;
    }
    .__form_group {
      width: 100%;
      align-items: start;
      justify-items: start;
      justify-content: center;
      width: calc(100% - 50px);
      margin-left: 3em;
    }

    .__form_action {
      padding: 12px;
      display: flex;
      flex: 0 0 auto;
      align-items: right;
      flex-direction: row;
      justify-items: center;
      justify-content: right;
      width: 250px;
    }
    .expense-page__table {
      background-color: #EFF2F7;
      border: 1px solid #C0CCDA;
      width: calc(100% - 24px);
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
      background-color: #ffffff;
    }
  `
})
export class ExpenseByIdComponent implements OnInit, OnDestroy {

  userExpenses: ExpenseWithCategoryName[] = [];

  selectedExpenseData: ExpenseWithCategoryName | null = null;

  expenseForm = this.fb.group({
    selectedExpenseId: ['', Validators.required]
  });

  private destroy$ = new Subject<void>();

  constructor(
    private expensesService: ExpensesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.expensesService.getUserExpensesWithCatName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(expenses => {
        this.userExpenses = expenses;
      });
  }

  onSubmit(): void {
    if (!this.expenseForm.valid) {
      return;
    }

    const selectedId = this.expenseForm.value.selectedExpenseId;

    const selectedIdInt = parseInt(selectedId!, 10) || null

    this.selectedExpenseData = this.userExpenses.find(exp =>
      exp.expenseId === selectedIdInt
    ) || null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
