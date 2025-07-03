import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../../categories.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../security/auth.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [ ReactiveFormsModule, NgFor, NgIf ],
  template: `
    <div class="__page __add_expense">
      <form [formGroup]="addExpenseForm" (ngSubmit)="onSubmit()">

        <div class="__form_group">
          <label for="amount">Amount $:</label>
          <input
            id="amount"
            step="0.01"
            name="amount"
            type="number"
            formControlName="amount"
            placeholder="Example: 10.55"
          >
          <div *ngIf="addExpenseForm.get('amount')?.invalid && addExpenseForm.get('amount')?.touched" class="error">
            Valid amount required (min $0.01)
          </div>
        </div>

        <div class="__form_group">
          <label for="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            formControlName="description"
            placeholder="Example: 'Lunch'"
          >
          <div *ngIf="addExpenseForm.get('description')?.invalid && addExpenseForm.get('description')?.touched" class="error">
            Description is required
          </div>
        </div>

        <div class="__form_group">
          <label for="categoryId">Category:</label>
          <select
            id="categoryId"
            name="categoryId"
            formControlName="categoryId"
          >
            <option value="" disabled>Select a category</option>
            <option *ngFor="let cat of categories" [value]="cat.categoryId">{{ cat.name }}</option>
          </select>
          <div *ngIf="addExpenseForm.get('categoryId')?.invalid && addExpenseForm.get('categoryId')?.touched" class="error">
            Category is required
          </div>
        </div>

        <div class="__form_group">
          <label>Date:</label>
          <input
            id="date"
            type="date"
            name="date"
            formControlName="date"
          >
          <div *ngIf="addExpenseForm.get('date')?.invalid && addExpenseForm.get('date')?.touched" class="error">
            Valid date is required
          </div>
        </div>

        <div class="__grid rows notifications">{{ notification }}</div>

        <div class="__form_action">
          <input
            type="submit"
            class="__button primary"
            value="Add Expense"
            [disabled]="addExpenseForm.invalid"
          >
        </div>

      </form>
    </div>
  `,
  styles: `
    .__form_group {
      align-items: start;
      justify-items: center
      justify-content: center;
      margin: auto auto 28px auto;
    }
    .__form_group input,
    .__form_group select {
      margin: 0;
    }
    .__form_action {
      display: flex;
      flex: 0 0 auto;
      align-items: right;
      flex-direction: row;
      justify-items: right;
      justify-content: right;
    }
      .__form_action input[type="button"] {
        width: 10em;
        margin: auto;
        display: block;
        position: relative;
      }
      .__form_action input[type="button"]:before {
        content: '+';
        width: 20px;
        height: 20px;
        background: #333;
      }
  `
})
export class AddExpenseComponent {

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

    private http: HttpClient,

    private authService: AuthService,

    private categoryService: CategoryService

  ) {}

  get selectedCategory(): string {
    return this.addExpenseForm.controls['categoryId'].value || '';
  }

  ngOnInit() {
    this.loadCategories();
  }

  onSubmit() {
    if (this.addExpenseForm.valid) this.onCreateExpense();
    else this.onShowErrors();
  }

  onCreateExpense() {
    const // Get form values with type safety

      formData = this.addExpenseForm.value,

      dateValue = formData.date as string,  // Type assertion

      amountValue = formData.amount as string,  // Type assertion

      expenseData = { // Format data for API

        date:         new Date(dateValue).toISOString(),

        amount:       parseFloat(amountValue).toFixed(2),

        userId:       parseInt(`${this.userID}`),

        categoryId:   parseInt(`${formData.categoryId}`),

        description:  formData.description

      }
    ;

    // Clear previous notifications
    this.notification = null;

    this.http.post(`${environment.apiBaseUrl}/api/expenses/add-expense`, expenseData).subscribe({
      next: (res) => this.onSuccess(),
      error: (err) => this.onError(err)
    });
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
    this.categoryService.getCategoriesByUserId().subscribe({
      next: (data) => this.categories = data,
      error: (err) => {
        console.error('Failed to load categories', err);
        this.notification = 'Failed to load categories';
      }
    });
  }
}
