import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { ExpensesService, Expense } from '../expenses.service';
import { CategoriesService } from '../../categories/categories.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-expense-add',
  standalone: true,
  imports: [ ReactiveFormsModule, NgFor, NgIf ],
  template: `
    <div class="__page __add_expense">
      <div class="__grid columns form_container">
        <form [formGroup]="addExpenseForm" (ngSubmit)="onSubmit()">

          <div class="__form_group">
            <label for="amount">Amount $: <span class="__form_required">*</span></label>
            <input
              id="amount"
              step="0.01"
              name="amount"
              type="number"
              formControlName="amount"
              placeholder="Example: 10.55"
            >
            <div *ngIf="addExpenseForm.get('amount')?.invalid && addExpenseForm.get('amount')?.touched" class="__form_error">
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
            <div *ngIf="addExpenseForm.get('description')?.invalid && addExpenseForm.get('description')?.touched" class="__form_error">
              a description is required
            </div>
          </div>

          <div class="__form_group">
            <label for="categoryId">Category: <span class="__form_required">*</span></label>
            <select
              id="categoryId"
              name="categoryId"
              formControlName="categoryId"
            >
              <option class="category-option" value="" disabled>Select a category</option>
              <option class="category-option" *ngFor="let cat of categories" [value]="cat.categoryId">{{ cat.name }}</option>
            </select>
            <div *ngIf="addExpenseForm.get('categoryId')?.invalid && addExpenseForm.get('categoryId')?.touched" class="__form_error">
              a category must be selected!
            </div>
          </div>

          <div class="__form_group">
            <label>Date: <span class="__form_required">*</span></label>
            <input
              id="date"
              type="date"
              name="date"
              placeholder="Date"
              formControlName="date"
            >
            <div *ngIf="addExpenseForm.get('date')?.invalid && addExpenseForm.get('date')?.touched" class="__form_error">
              a valid date is required!
            </div>
          </div>

          <div class="__grid rows notifications">{{ notification }}</div>

          <div class="__form_action">
            <input
              type="submit"
              class="__button tertiary"
              value="Add Expense"
              [disabled]="addExpenseForm.invalid"
            >
          </div>

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
      background: rgba(0, 0, 0, 0.05);
    }
    .__form_action {
      padding: 12px;
      display: flex;
      flex: 0 0 auto;
      align-items: right;
      flex-direction: row;
      justify-items: center;
      justify-content: right;
      width: calc(100% - 24px);
    }
    .__form_action input[type="submit"] {
      margin: 0;
      width: auto;
      max-width: 30%;
      min-width: 140px;
    }
  `
})
export class ExpenseAddComponent implements OnInit {

  userID: any = this.authService.getUserId();

  categories: any[] = [];

  notification: string | null = null;

  addExpenseForm = this.fb.group({
    date: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    categoryId: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(

    private fb: FormBuilder,

    private authService: AuthService,

    private expensesService: ExpensesService,

    private categoriesService: CategoriesService

  ) {}

  get selectedCategory(): string {
    return this.addExpenseForm.controls['categoryId'].value || '';
  }

  ngOnInit() {
    this.loadCategories();
  }

  onSubmit() {
    if (this.addExpenseForm.valid) this.createExpense();
    else this.onShowErrors();
  }

  createExpense() {
    const // Get form values with type safety

      formData = this.addExpenseForm.value,

      dateValue = formData.date as string,  // Type assertion

      amountValue = formData.amount as string,  // Type assertion

      expenseData = { // Format data for API

        date:         new Date(dateValue).toISOString(),

        amount:       amountValue,

        userId:       parseInt(`${this.userID}`, 10),

        categoryId:   parseInt(`${formData.categoryId}`),

        description:  formData.description

      },
      newExpense = expenseData as Expense
    ;

    // Clear previous notifications
    this.notification = null;
    this.expensesService.addExpense(newExpense).subscribe({
      next: (res) => this.onSuccess(),
      error: (err) => this.onError(err)
    });
    /*this.http.post(`${environment.apiBaseUrl}/api/expenses/add-expense`, expenseData).subscribe({
      next: (res) => this.onSuccess(),
      error: (err) => this.onError(err)
    });*/
  }

  onSuccess() {
    this.notification = 'Expense added successfully!';
    this.addExpenseForm.reset();
    // Clear success message after 3 seconds
    setTimeout(() => this.notification = null, 3000);
  }

  onError( err: any ) {
    console.error('Error adding expense:', err);
    this.notification = 'Failed to add expense. Please try again.';
    // Clear error message after 5 seconds
    setTimeout(() => this.notification = null, 5000);
  }

  onShowErrors() {
    // Mark all fields as touched to show validation errors
    this.addExpenseForm.markAllAsTouched();
  }

  loadCategories() {
    this.categoriesService.getAllCategoriesByUserId().subscribe({
      next: (data) => this.categories = data,
      error: (err) => {
        console.error('Failed to load categories', err);
        this.notification = 'Failed to load categories';
      }
    });
  }
}
