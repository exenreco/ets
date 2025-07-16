import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../security/auth.service';
import { CategoriesService, Category } from '../categories.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [ ReactiveFormsModule, NgFor, NgIf  ],
  template: `
    <div class="__page __add_expense">
      <div class="__grid columns form_container">
        <form [formGroup]="addExpenseCategoryForm" class="addExpenseCategoryForm" (ngSubmit)="onSubmit()">

          <div class="__form_group">
            <label for="name">Category name<span class="__form_required">*</span></label>
            <input
              id="name"
              name="name"
              type="text"
              formControlName="name"
              maxlength="50"
              placeholder="Example: Grocery..."
            >
            <div *ngIf="addExpenseCategoryForm.get('name')?.invalid && addExpenseCategoryForm.get('name')?.touched" class="__form_error">
              a valid category name is required
            </div>
          </div>

          <div class="__form_group">
            <label for="description">Description: <span class="__form_required">*</span></label>
            <input
              type="text"
              id="description"
              name="description"
              formControlName="description"
              maxlength="50"
              placeholder="Example: All expense spent on food"
            >
            <div *ngIf="addExpenseCategoryForm.get('description')?.invalid && addExpenseCategoryForm.get('description')?.touched" class="__form_error">
              a description is required
            </div>
          </div>

          <div class="__grid rows notifications">{{ notification }}</div>

          <div class="__form_action">
            <input
              type="submit"
              class="__button tertiary"
              value="Add Category"
              [disabled]="addExpenseCategoryForm.invalid"
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
export class CategoryAddComponent {
  userID: any = this.authService.getUserId();

  categories: any[] = [];

  notification: string | null = null;

  addExpenseCategoryForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor(

    private fb: FormBuilder,

    private authService: AuthService,

    private categoriesService: CategoriesService

  ) {}

  onSubmit() {
    if (this.addExpenseCategoryForm.valid) this.createExpense();
    else this.onShowErrors();
  }

  createExpense() {
    const // Get form values with type safety
      formData = this.addExpenseCategoryForm.value,

      categoryData = { // Format data for API

        name:         formData.name,

        slug:         `${formData.name?.toLowerCase}-${this.userID}`,

        userId:       parseInt(`${this.userID}`, 10),

        description:  formData.description

      },
      newCategory = categoryData as Category
    ;

    // Clear previous notifications
    this.notification = null;
    this.categoriesService.addCategory(newCategory).subscribe({
      next: (res) => this.onSuccess(),
      error: (err) => this.onError(err)
    });
  }

  onSuccess() {
    this.notification = 'Category added successfully!';
    this.addExpenseCategoryForm.reset();
    // Clear success message after 3 seconds
    setTimeout(() => this.notification = null, 3000);
  }

  onError( err: any ) {
    console.error('Error adding category:', err);
    this.notification = 'Failed to add category. Please try again.';
    // Clear error message after 5 seconds
    setTimeout(() => this.notification = null, 5000);
  }

  onShowErrors() {
    // Mark all fields as touched to show validation errors
    this.addExpenseCategoryForm.markAllAsTouched();
  }
}
