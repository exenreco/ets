import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriesService, Category} from '../categories.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-by-id',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="__page __categoryById">
      <div class="__grid columns form_container">
        <form [formGroup]="categoryForm" class="form_container" (ngSubmit)="onSubmit()">

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
            <table *ngIf="selectedCategoryData" class="category-page__table">
              <thead class="category-page__table-head">
                <tr class="category-page__table-row">
                  <th class="category-page__table-header">Category</th>
                  <th class="category-page__table-header">Amount</th>
                  <th class="category-page__table-header">Description</th>
                  <th class="category-page__table-header">Date Created</th>

                </tr>
              </thead>
              <tbody class="category-page__table-body">
                @for (category of [selectedCategoryData]; track category) {
                  <tr class="category-page__table-row">
                    <td class="category-page__table-cell">{{ category.name }}</td>
                    <td class="category-page__table-cell">{{ category.categoryId }}</td>
                    <td class="category-page__table-cell">{{ category.description }}</td>
                    <td class="category-page__table-cell">{{ category.dateCreated | date }}</td>

                  </tr>
                }
              </tbody>
          </table>
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
    }
  `
})
export class CategoryByIdComponent implements OnInit, OnDestroy {
  userCategories: Category[] = [];
  selectedCategoryData: Category | null = null;
  categoryForm = this.fb.group({
    selectedCategoryId: ['', Validators.required]
  });

  private destroy$ = new Subject<void>();

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categoriesService.getAllCategoriesByUserId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.userCategories = categories;
      });
  }

  onSubmit(): void {
    console.log('Form submitted!');
    console.log('Form valid:', this.categoryForm.valid);
    console.log('Form value:', this.categoryForm.value);
    console.log('Selected ID:', this.categoryForm.value.selectedCategoryId);

    if (!this.categoryForm.valid) {
      console.log('Form is invalid, returning early');
      return;
    }

    const selectedId = this.categoryForm.value.selectedCategoryId; // Keep as string
    console.log('Selected ID (string):', selectedId);

    this.selectedCategoryData = this.userCategories.find(cat => {
      console.log('Comparing:', cat.categoryId, 'with', selectedId);
      console.log('Types:', typeof cat.categoryId, 'vs', typeof selectedId);
      return cat.categoryId.toString() === (selectedId != null ? selectedId.toString() : ''); // Compare as strings, handle null/undefined
    }) || null;

    console.log('Selected category data:', this.selectedCategoryData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
