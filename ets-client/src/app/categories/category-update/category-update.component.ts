import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService, Category } from '../../categories/categories.service';

@Component({
  selector: 'app-category-update',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="__page __update_category">
      <div class="__grid columns form_container">
        <form class="__form" [formGroup]="updateCategoryForm" (ngSubmit)="onSubmit()">

          @if( userCategories && userCategories.length >= 1 ){
            <div class="__form_group">
              <label for="categoryId">Select Category:</label>
              <select id="categoryId" name="categoryId" formControlName="categoryId">
                <option class="category-option" value="" disabled>Choose a category to update</option>
                @for (cat of userCategories; track cat.categoryId) {
                  <option class="category-option" [value]="cat.categoryId">{{cat.name}} - Description: {{cat.description}}</option>
                }
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

          @if( selectedCategoryData ){
            <hr>
            <div class="update-fields-container">
              <div class="__form_group">
                <label for="name">Category name: <span class="__form_required">*</span></label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  maxlength="50"
                  formControlName="name"
                  placeholder="Example: Groceries | Utilities | Other"
                >
                <div *ngIf="updateCategoryForm.get('name')?.invalid && updateCategoryForm.get('name')?.touched" class="__form_error">
                  a valid name is required!
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
                  placeholder="Example: 'Lunch'"
                >
                <div *ngIf="updateCategoryForm.get('description')?.invalid && updateCategoryForm.get('description')?.touched" class="__form_error">
                  a description is required!
                </div>
              </div>

              <div class="__grid rows notifications">{{ notification }}</div>

              <div class="__form_action">
                <input
                  type="submit"
                  class="__button tertiary"
                  value="Update Category"
                  [disabled]="updateCategoryForm.invalid"
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
export class CategoryUpdateComponent implements OnInit {

  // messages
  notification: string | null = null;

  // all categories belonging to user
  userCategories: Category[] = [];

  // the current userId
  userID: any = this.authService.getUserId();

  // The category to update
  selectedCategoryData: Category | null = null;

  //
  private destroy$ = new Subject<void>();


  constructor(

    private router: Router,

    private fb: FormBuilder,

    private authService: AuthService,

    private categoriesService: CategoriesService

  ) {}

  updateCategoryForm = this.fb.group({
    name:         ['', Validators.required],
    categoryId:   ['', Validators.required],
    description:  ['', Validators.required]
  });

  ngOnInit(): void {
    // store all categories own by user
    this.categoriesService.getAllCategoriesByUserId()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.userCategories = res;
        // Setup category selection listener
        this.setupCategorySelectionListener();
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        //this.notification = 'Failed to load categories';
      }
    });
  }

  private setupCategorySelectionListener(): void {
    this.updateCategoryForm.get('categoryId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(categoryId => {
        // Handle empty selection
        if (!categoryId) {
          this.selectedCategoryData = null;
          return;
        }

        // Find selected category (using string comparison)
        this.selectedCategoryData = this.userCategories.find(
          cat => cat.categoryId.toString() === categoryId
        ) || null;

        // Update form fields if category found
        if (this.selectedCategoryData) {
          this.updateCategoryForm.patchValue({
            name: this.selectedCategoryData.name,
            description: this.selectedCategoryData.description
          });
        }
      });
  }

  onSubmit() {
    // nothing happens on invalid selection
    if (this.updateCategoryForm.valid) this.updateCategory();
    else this.updateCategoryForm.markAllAsTouched();
  }

  updateCategory() {
    const // Get form values with type safety

      formData = this.updateCategoryForm.value,

      categoryData = { // Format data for API

        userId:       parseInt(this.userID!),

        name:         formData.name!,

        slug:         `${formData.name?.toLowerCase()}-${formData.categoryId}`,

        categoryId:   parseInt(formData.categoryId!),

        description:  formData.description!

      },
      updateCategory = categoryData as Category
    ;

    // Clear previous notifications
    this.notification = null;

    if( updateCategory === null ){
      this.onError('There was an error with your changes');
      return;
    } else {
      this.categoriesService.updateCategory(updateCategory).subscribe({
        next: () =>  this.onSuccess(),
        error: (err: any) => this.onError(err)
      })
    }
  }

  onSuccess() {
    this.notification = 'Category successfully updated!';
    this.updateCategoryForm.reset();
    // Clear success message after 3 seconds
    setTimeout(() => {
      this.notification = null;
      this.selectedCategoryData = null;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard/category-list']);
    });
    }, 1000);
  }

  onError( err: any ) {
    console.error('Error updating category:', err);
    this.notification = `Failed to update category. ${err}`;
    // Clear error message after 5 seconds
    setTimeout(() => this.notification = null, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
