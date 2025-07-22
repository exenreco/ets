import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { DeleteCategoryComponent } from './delete-category.component';
import { CategoriesService, Category } from '../categories.service';
import { CommonModule } from '@angular/common';

describe('DeleteCategoryComponent', () => {
  let component: DeleteCategoryComponent;
  let fixture: ComponentFixture<DeleteCategoryComponent>;
  let mockCategoriesService: jasmine.SpyObj<CategoriesService>;

  const mockCategories: Category[] = [
    {
      categoryId: 1,
      userId: 1,
      name: 'Food',
      description: 'Food and dining expenses',
      dateCreated: new Date('2025-07-19T10:00:00Z')
    },
    {
      categoryId: 2,
      userId: 1,
      name: 'Transportation',
      description: 'Transport related expenses',
      dateCreated: new Date('2025-07-18T14:30:00Z')
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CategoriesService', ['getAllCategoriesByUserId', 'deleteCategory']);

    await TestBed.configureTestingModule({
      imports: [DeleteCategoryComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: CategoriesService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCategoryComponent);
    component = fixture.componentInstance;
    mockCategoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
  });

  it('should create and load user categories on init', () => {
    mockCategoriesService.getAllCategoriesByUserId.and.returnValue(of(mockCategories));

    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(mockCategoriesService.getAllCategoriesByUserId).toHaveBeenCalled();
    expect(component.userCategories).toEqual(mockCategories);
  });

  it('should select category and display details when form is submitted', () => {
    component.userCategories = mockCategories;

    // Set form value
    component.deleteCategoryForm.patchValue({ selectedCategoryId: '1' });

    // Submit form
    component.onSubmit();

    expect(component.selectedCategoryData).toEqual(mockCategories[0]);
    expect(component.selectedCategoryData?.categoryId).toBe(1);
    expect(component.selectedCategoryData?.name).toBe('Food');
  });

  it('should successfully delete category and refresh data', () => {
    // Setup initial data
    component.userCategories = mockCategories;
    component.selectedCategoryData = mockCategories[0];

    // Mock successful deletion - fix the return type here
    mockCategoriesService.deleteCategory.and.returnValue(of(undefined as any));
    mockCategoriesService.getAllCategoriesByUserId.and.returnValue(of([mockCategories[1]])); // Return remaining category

    // Call delete
    component.deleteCategory(1);

    expect(mockCategoriesService.deleteCategory).toHaveBeenCalledWith(1);
    expect(component.isDeleting).toBeFalse();
    expect(component.selectedCategoryData).toBeNull();
    expect(mockCategoriesService.getAllCategoriesByUserId).toHaveBeenCalledTimes(1);
  });
});
