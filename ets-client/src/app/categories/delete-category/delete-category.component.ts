//Checks to ensure that a category can only be deleted if there are no expenses associated with it must be added.
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriesService, Category} from '../categories.service';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ExpensesService, ExpenseWithCategoryName } from '../../expenses/expenses.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="_page __delete_category">
      <div class="__grid columns form_container">
        <form [formGroup]="deleteCategoryForm" class="form_container" (ngSubmit)="onDelete()">

         @if( userCategories && userCategories.length >= 1 ){
          <div class="__form_group">
            <label for="categoryId">Choose an Expense Category to delete:</label>
            <select id="categoryId" name="categoryId" formControlName="categoryId" >
              <option value="">-- Select a category --</option>
              <option *ngFor="let category of userCategories" [value]="category.categoryId">
                ID #: {{ category.categoryId }} - {{ category.name }}
              </option>
            </select>
          </div>
         } @else {
           <div class="__grid rows no-category">
              <span>
                There is nothing to update, try adding some categories!
                <a class="__link" routerLink="/dashboard/add-category">Add Category</a>
              </span>
            </div>
          }


          @if( selectedCategoryData ) {
            <hr>
            <div class="delete-fields-container">
              <h2 class="__widget_title">
                <small>Category Details</small>
                ID #: {{ selectedCategoryData.categoryId }}
              </h2><hr>
              <ul class="__list">
                <li><b>Date:</b> {{ selectedCategoryData.name }}</li>
                <li><b>Category:</b> {{ selectedCategoryData.categoryId }}</li>
                <li><b>Description:</b> {{ selectedCategoryData.description }}</li>
                <li><b>Created On:</b> {{ selectedCategoryData.dateCreated | date }}</li>
              </ul>

              <div class="__grid rows notifications">{{ notification }}</div>

              <div class="__form_action">
                <input
                  type="submit"
                  class="__button tertiary"
                  value="Delete Category"
                  [disabled]="deleteCategoryForm.invalid"
                />
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
    .category-page__table {
      background-color: #EFF2F7;
      border: 1px solid #C0CCDA;
      width: calc(100% - 24px);
    }
    .category-page__table-header {
      text-align: left;
      font-weight: bold;
      padding: 25px 25px 40px 25px;
    }
    .category-page__table-cell {
      text-align: left;
      padding: 25px 25px 40px 25px;
      border-top: 1px solid #C0CCDA;
      border-bottom: 1px solid #C0CCDA;
      background-color: #ffffff;
      vertical-align: middle;
    }
    .category-page__table-cell form {
      margin: 0;
      padding: 0;
      display: inline;
    }
    .__button tertiary{
      padding: 8px 16px;
      border-radius: 4px;
      margin: 0;
      vertical-align: middle;
    }

    .__button tertiary:hover:not(:disabled) {
      background-color: #c82333;
      border-color: #bd2130;
    }

    .__button tertiary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
export class DeleteCategoryComponent implements OnInit {

  // messages
  notification: string | null = null;

  userCategories: Category[] = [];

  userExpenses: ExpenseWithCategoryName[] = [];

  selectedCategoryData: Category | null = null;

  private destroy$ = new Subject<void>();

  constructor(

    private fb: FormBuilder,

    private expensesService: ExpensesService,

    private categoriesService: CategoriesService

  ) {}

  // Initialize the form in constructor
  deleteCategoryForm = this.fb.group({
    categoryId: ['', Validators.required]
  });

  ngOnInit(): void {

    // load user expenses with category names
    this.expensesService.getUserExpensesWithCatName().subscribe({
      next: (expenses) => this.userExpenses = expenses,
      error: (err) => console.error('Failed to load user expenses', err)
    });

    // Load categories when the component initializes
    this.categoriesService.getAllCategoriesByUserId().subscribe({
      next: (categories) => {
        this.userCategories = categories;

        // Add listener for expense selection changes
        this.deleteCategoryForm.get('categoryId')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(categoryId => {
          if (categoryId === null) {
            // handle null case, maybe return early or log error
            console.warn('Received null categoryId');
            return;
          }
          const parsedCategoryId = parseInt(categoryId, 10);
          this.handleCategorySelection(parsedCategoryId);
        });
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  handleCategorySelection(categoryId: number): void {
    if (!categoryId) {
      this.selectedCategoryData = null;
      return;
    }

    // find category with matching id
    const category = this.userCategories.find(e => e.categoryId === categoryId);

    this.selectedCategoryData = category || null;

    console.log( this.userCategories);
    console.log(`Selected category ID: ${categoryId}`, this.selectedCategoryData);
  }


  onDelete(): void {
    // nothing happens on invalid selection
    if (this.deleteCategoryForm.valid) this.deleteCategory();
    else this.deleteCategoryForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
  }

  deleteCategory() {
    // Clear previous notifications
    this.notification = null;

    // get the id of the targeted category
    const categoryId = this.selectedCategoryData?.categoryId;

    if ( ! categoryId ) {
      console.error('Cannot delete category: ID is undefined');
      return;
    }
    if (this.userExpenses.some(expense => expense.categoryId === categoryId)) {
      this.notification = `Cannot delete category: ${categoryId}. There are expenses associated with this category. Please delete those expenses first.`;
      console.warn(this.notification);
      return;
    }


    if( confirm(`Are you sure you want to delete category: ${categoryId}? This action cannot be undone!`) ) {
      this.categoriesService.deleteCategory(categoryId).subscribe({
        next: (res) =>  {
          console.log(`Category with ID ${categoryId} deleted successfully.`);
          // Optionally, refresh the categories list
          this.categoriesService.getAllCategoriesByUserId().subscribe(categories => {
            this.userCategories = categories;
            this.selectedCategoryData = null; // Clear selected data after deletion
          });
          this.notification = `Category: ${categoryId} has successfully been deleted!`;
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.notification = `Error deleting category: ${err.message}`;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
