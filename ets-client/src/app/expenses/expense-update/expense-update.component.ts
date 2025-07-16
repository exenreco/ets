import { Subject } from 'rxjs';
import { NgIf } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { Expense, ExpensesService } from '../expenses.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService, Category } from '../../categories/categories.service';



@Component({
  selector: 'app-expense-update',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink, NgIf ],
  template: `
    <div class="__page __update_expense">
      <div class="__grid columns form_container">
        <form class="__form" [formGroup]="updateExpenseForm" (ngSubmit)="onSubmit()">

          @if( userExpenses && userExpenses.length >= 1 ){
            <div class="__form_group">
              <label for="expenseId">Select Expense:</label>
              <select id="expenseId" name="expenseId" formControlName="expenseId">
                <option class="expense-option" value="" disabled>Choose an Expense to update</option>
                @for (exp of userExpenses; track exp) {
                  <option class="expense-option" [value]="exp.expenseId">{{exp.description}} - \${{ exp.amount }}</option>
                }
              </select>
            </div>
          } @else {
           <div class="__grid rows no-expense">
              <span>
                There is nothing to update, try adding some expenses!
                <a class="__link" routerLink="/dashboard/add-expense">Add Expense</a>
              </span>
            </div>
          }

          @if( selectedExpenseData ){
            <hr>
            <div class="update-fields-container">
              <div class="__form_group">
                <label for="amount">Amount $: <span class="__form_required">*</span></label>
                <input
                  step="0.01"
                  id="amount"
                  name="amount"
                  type="number"
                  formControlName="amount"
                  placeholder="Example: 10.55"
                >
                <div *ngIf="updateExpenseForm.get('amount')?.invalid && updateExpenseForm.get('amount')?.touched" class="__form_error">
                  a valid amount is required (min $0.01)!
                </div>
              </div>

              <div class="__form_group">
                <label for="description">Description: <span class="__form_required">*</span></label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  formControlName="description"
                  placeholder="Example: 'Lunch'"
                >
                <div *ngIf="updateExpenseForm.get('description')?.invalid && updateExpenseForm.get('description')?.touched" class="__form_error">
                  a description is required!
                </div>
              </div>

              <div class="__form_group">
                <label for="categoryId">Category: <span class="__form_required">*</span></label>
                <select id="categoryId" name="categoryId" formControlName="categoryId">
                  <option disabled>choose a category</option>
                  @for (cat of userCategories; track cat) {
                    <option [value]="cat.categoryId">{{cat.name}}</option>
                  }
                </select>
                <div *ngIf="updateExpenseForm.get('categoryId')?.invalid && updateExpenseForm.get('categoryId')?.touched" class="__form_error">
                  a category must be selected!
                </div>
              </div>

              <div class="__form_group">
                <label for="date">Date: <span class="__form_required">*</span></label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  placeholder="Date"
                  formControlName="date"
                >
                <div *ngIf="updateExpenseForm.get('date')?.invalid && updateExpenseForm.get('date')?.touched" class="__form_error">
                  a valid date is required!
                </div>
              </div>

              <div class="__grid rows notifications">{{ notification }}</div>

              <div class="__form_action">
                <input
                  type="submit"
                  class="__button tertiary"
                  value="Update Expense"
                  [disabled]="updateExpenseForm.invalid"
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
    .__form_group {
      width: 100%;
      align-items: start;
      justify-items: start;
      justify-content: left;
    }
    .update-fields-container {
      padding: 5px;
      border-radius: .4em;
      width: calc(100% - 10px);
      background: var(--complimentary-color-soft-blue, #CBEEF3);
    }
    .update-fields-container .__form_action {
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
    .update-fields-container .__form_action input[type="submit"] {
      margin: 0;
      width: auto;
      max-width: 30%;
      min-width: 140px;
    }
  `
})
export class ExpenseUpdateComponent implements OnInit {

  // messages
  notification: string | null = null;

  // all user expense
  userExpenses: Expense[] = [];

  // all categories belonging to user
  userCategories: Category[] = [];

  // the current userId
  userID: any = this.authService.getUserId();

  // The expense to update
  selectedExpenseData: Expense | null = null;

  //
  private destroy$ = new Subject<void>();


  constructor(

    private router: Router,

    private fb: FormBuilder,

    private authService: AuthService,

    private expensesService: ExpensesService,

    private categoriesService: CategoriesService

  ) {
    // store all categories owned by user
    this.categoriesService.getAllCategoriesByUserId().subscribe({
      next:(res) => this.userCategories = res,
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    })
  }

  updateExpenseForm = this.fb.group({
    date:         ['', Validators.required],
    amount:       ['', [Validators.required, Validators.min(0.01)]],
    expenseId:    ['', Validators.required],
    categoryId:   ['', Validators.required],
    description:  ['', Validators.required]
  });

  ngOnInit(): void {
    // store all expenses own by user
    this.expensesService.getAllExpensesByUserId().subscribe({
      next: (res) => {
        this.userExpenses = res;
        // Add listener for expense selection changes
        this.updateExpenseForm.get('expenseId')?.valueChanges
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
      error: (err) => {
        console.error('Failed to load categories', err);
        //this.notification = 'Failed to load categories';
      }
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

    console.log( expense );
    if (expense) {

      const
        dateRaw = new Date(`${expense.date}`),
        dateIso = dateRaw.toISOString().substring(0, 10)
      ;

      // Update amount field
      this.updateExpenseForm.get('amount')!.setValue(expense.amount.toString());
      this.updateExpenseForm.get('description')!.setValue(`${expense.description}`);
      this.updateExpenseForm.get('categoryId')!.setValue(expense.categoryId.toString());
      this.updateExpenseForm.get('date')!.setValue(dateIso);
    } else {
      this.updateExpenseForm.get('amount')?.reset();
      this.updateExpenseForm.get('description')?.reset();
      this.updateExpenseForm.get('categoryId')?.reset();
      this.updateExpenseForm.get('date')?.reset();
    }
  }

  onSubmit() {
    // nothing happens on invalid selection
    if (this.updateExpenseForm.valid) this.updateExpense();
    else this.updateExpenseForm.markAllAsTouched(); // Mark all fields as touched to show validation errors

    //console.log( this.findExpense(this.selectedExpense) );
  }

  updateExpense() {
    const // Get form values with type safety

      formData = this.updateExpenseForm.value,

      dateValue = formData.date as string,  // Type assertion

      amountValue = formData.amount as string,  // Type assertion

      expenseData = { // Format data for API

        ...this.selectedExpenseData,

        date:         new Date(dateValue).toISOString(),

        amount:       amountValue,

        userId:       parseInt(`${this.userID}`),

        categoryId:   parseInt(`${formData.categoryId}`),

        description:  formData.description

      },
      updateExpense = expenseData as Expense
    ;

    // Clear previous notifications
    this.notification = null;

    if( updateExpense === null ){
      this.onError('There was an error with your changes');
      return;
    } else {
      this.expensesService.updateExpense(updateExpense).subscribe({
        next: (res) =>  this.onSuccess(),
        error: (err) => this.onError(err)
      })
    }
  }

  onSuccess() {
    this.notification = 'Expense successfully updated!';
    this.updateExpenseForm.reset();
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
    console.error('Error updating expense:', err);
    this.notification = `Failed to update expense. ${err}`;
    // Clear error message after 5 seconds
    setTimeout(() => this.notification = null, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
