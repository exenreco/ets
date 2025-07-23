import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../security/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpensesService, ExpenseWithCategoryName } from '../expenses.service';

@Component({
  selector: 'app-delete-expense',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="__page __delete_expense">
      <div class="__grid columns form_container">
        <form class="__form" [formGroup]="deleteExpenseForm" (ngSubmit)="onDelete()">

          @if( userExpenses && userExpenses.length >= 1 ){
            <div class="__form_group">
              <label for="expenseId">Choose an Expense to delete:</label>
              <select id="expenseId" name="expenseId" formControlName="expenseId">
                <option class="expense-option" value="" disabled>-- Select an Expense --</option>
                @for (exp of userExpenses; track exp) {
                  <option class="expense-option" [value]="exp.expenseId">
                    ID #: {{exp.expenseId}} - {{ exp.description }}
                  </option>
                }
              </select>
            </div>
          } @else {
           <div class="__grid rows no-expense">
              <span>
                There is nothing to delete, try adding some expenses!
                <a class="__link" routerLink="/dashboard/add-expense">Add Expense</a>
              </span>
            </div>
          }

          @if( selectedExpenseData ){
            <hr>
            <div class="delete-fields-container">
              <h2 class="__widget_title">
                <small>Expense Details</small>
                ID #: {{ selectedExpenseData.expenseId }}
              </h2><hr>
              <ul class="__list">
                <li><b>Date:</b> {{ selectedExpenseData.date | date }}</li>
                <li><b>Amount:</b> \${{ selectedExpenseData.amount }}</li>
                <li><b>Category:</b> {{ selectedExpenseData.categoryName }}</li>
                <li><b>Description:</b> {{ selectedExpenseData.description }}</li>
                <li><b>Created On:</b> {{ selectedExpenseData.dateCreated | date }}</li>
              </ul>

              <div class="__grid rows notifications">{{ notification }}</div>

              <div class="__form_action">
                <input
                  type="submit"
                  value="Delete Expense"
                  class="__button tertiary"
                  [disabled]="deleteExpenseForm.invalid"
                >
              </div>
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
    .__form_group {
      width: 100%;
      align-items: start;
      justify-items: start;
      justify-content: left;
    }
    .delete-fields-container {
      padding: 5px;
      border-radius: .4em;
      width: calc(100% - 10px);
      background: var(--complimentary-color-soft-blue, #CBEEF3);
    }
    .delete-fields-container .__form_action {
      padding: 12px;
      display: flex;
      flex: 0 0 auto;
      align-items: right;
      flex-direction: row;
      justify-items: center;
      justify-content: right;
      width: calc(100% - 24px);
    }
    .notifications {
      color: red;
      font-weight: bolder;
      text-align: center !important;
      align-items: center !important;
      margin-bottom: 12px !important;
      justify-items: center !important;
      justify-content: center !important;
      background: rgba(255,255,255,0.25);
    }
    .delete-fields-container .__form_action input[type="submit"] {
      margin: 0;
      width: auto;
      max-width: 30%;
      min-width: 140px;
    }
    .__list {
      list-style-type: none;
    }
    .__list li {
      margin-bottom: 14px;
    }
    .__list b {
      font-weight: 600;
    }
  `
})
export class DeleteExpenseComponent implements OnInit {

  // messages
  notification: string | null = null;

  // all user expense
  userExpenses: ExpenseWithCategoryName[] = [];

  // The expense to delete
  selectedExpenseData: ExpenseWithCategoryName | null = null;

  private destroy$ = new Subject<void>();

  constructor(

    private router: Router,

    private fb: FormBuilder,

    private authService: AuthService,

    private expensesService: ExpensesService

  ) {}

  deleteExpenseForm = this.fb.group({
    expenseId:    ['', Validators.required],
  });

  ngOnInit(): void {
    // store all expenses own by user
    this.expensesService.getUserExpensesWithCatName().subscribe({
      next: (res) => {
        this.userExpenses = res;
        // Add listener for expense selection changes
        this.deleteExpenseForm.get('expenseId')?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(expenseId => {
            if (expenseId === null) {
              // handle null case, maybe return early or log error
              console.warn('Received null expenseId');
              return;
            }

            const parsedExpenseId = parseInt(expenseId, 10);
            this.handleExpenseSelection(parsedExpenseId);
          });
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  private handleExpenseSelection(expenseId: number | null): void {
    if (!expenseId) {
      this.selectedExpenseData = null;
      return;
    }

    // find expense with matching id
    const expense = this.userExpenses.find(e => e.expenseId === expenseId);

    this.selectedExpenseData = expense || null;
  }

  onDelete() {
    // nothing happens on invalid selection
    if (this.deleteExpenseForm.valid) this.deleteExpense();
    else this.deleteExpenseForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
  }

  deleteExpense() {
    // Clear previous notifications
    this.notification = null;

    // get the id of the targeted expense
    const expenseId = this.selectedExpenseData?.expenseId;

    if( ! expenseId ){
      this.onError('There was an error with your changes');
      return;
    } else {
      if( confirm(`Are you sure you want to delete expense: ${expenseId}? This action cannot be undone!`) )
      this.expensesService.deleteExpenseByUserId(expenseId).subscribe({
        next: (res) =>  this.onSuccess(`Expense: ${expenseId} has successfully been deleted!`),
        error: (err) => this.onError(err)
      })
    }
  }

  onSuccess( msg: string | null) {
    if( msg ) this.notification = msg;

    this.deleteExpenseForm.reset();

    // Clear success message after 3 seconds
    setTimeout(() => {
      this.notification = null;
      this.selectedExpenseData = null;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard/expense-list']);
    });
    }, 1000);
  }

  onError( err: any ) {
    console.error('Error deleting expense:', err);
    this.notification = `Failed to delete expense. ${err['message']}`;
    // Clear error message after 5 seconds
    setTimeout(() => this.notification = null, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
