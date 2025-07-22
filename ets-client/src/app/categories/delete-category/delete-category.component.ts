//Checks to ensure that a category can only be deleted if there are no expenses associated with it must be added.
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriesService, Category} from '../categories.service';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="_page __delete_category">
      <div class="__grid columns form_container">
        <form [formGroup]="deleteCategoryForm" class="form_container" (ngSubmit)="onSubmit()">

         @if( userCategories && userCategories.length >= 1 ){
          <div class="__form_group">
            <label for="categorySelect">Select Category:</label>
            <select id="categorySelect" formControlName="selectedCategoryId" >
              <option value="">-- Select a category --</option>
              <option *ngFor="let category of userCategories" [value]="category.categoryId">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="__form_action">
            <input type="submit" class="__button tertiary" value="View Category Details" />
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
            <hr><div class="delete-fields-container">
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
              <form (ngSubmit)="deleteCategory(selectedCategoryData.categoryId)" class="__form_action">
                <input type="submit" class="__button tertiary" value="Delete"
                      [disabled]="isDeleting"
                      (click)="selectedCategoryData.categoryId !== undefined && confirmDelete($event, selectedCategoryData.categoryId, selectedCategoryData.name ?? '')" />
              </form>
            </div>
          } @else {
            <div class="__grid rows no-category">
              <span>
                Please select a category to view details.
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
export class DeleteCategoryComponent implements OnInit, OnDestroy {
  userCategories: Category[] = [];
  deleteCategoryForm: FormGroup; // Add this line
  selectedCategoryData: Category | null = null;
  isDeleting: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {
    // Initialize the form in constructor
    this.deleteCategoryForm = this.fb.group({
      selectedCategoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoriesService.getAllCategoriesByUserId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.userCategories = categories;
      });
  }

  onSubmit(): void {
    if (!this.deleteCategoryForm.valid) {
      return;
    }

    const selectedId = this.deleteCategoryForm.value.selectedCategoryId;

    console.log('Selected ID (string):', selectedId);

    this.selectedCategoryData = this.userCategories.find(cat => {
      return cat.categoryId.toString() === (selectedId != null ? selectedId.toString() : ''); // Compare as strings, handle null/undefined
    }) || null;

    console.log('Selected category data:', this.selectedCategoryData);
  }

  confirmDelete(event: Event, categoryId: number, name: string): void {
    event.preventDefault();
    const confirmed = confirm(`Are you sure you want to delete the category "${name}"? This action cannot be undone.`);
    if (confirmed) {
      this.deleteCategory(categoryId);
    }
  }

  deleteCategory(categoryId: number | undefined) {
    if (categoryId === undefined) {
      console.error('Cannot delete category: ID is undefined');
      return;
    }

    this.isDeleting = true;

    this.categoriesService.deleteCategory(categoryId).subscribe({
      next: () => {
        console.log(`Category with ID ${categoryId} deleted successfully.`);
        this.isDeleting = false;
        // Optionally, refresh the categories list
        this.categoriesService.getAllCategoriesByUserId().subscribe(categories => {
          this.userCategories = categories;
          this.selectedCategoryData = null; // Clear selected data after deletion
        });
      },
      error: (err) => {
        console.error('Error deleting category:', err);
        this.isDeleting = false;
      }
    });
  }

  private refreshUserCategories(): void {
    this.categoriesService.getAllCategoriesByUserId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.userCategories = categories;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
