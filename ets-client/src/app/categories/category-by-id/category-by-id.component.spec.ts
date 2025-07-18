import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CategoryByIdComponent } from './category-by-id.component';
import { CategoriesService, Category } from '../categories.service';

describe('CategoryByIdComponent', () => {
  let component: CategoryByIdComponent;
  let fixture: ComponentFixture<CategoryByIdComponent>;
  let mockCategoriesService: jasmine.SpyObj<CategoriesService>;

  const mockCategories: Category[] = [
    {
      categoryId: 101,
      name: 'Office Supplies',
      description: 'Items for office use',
      dateCreated: new Date('2025-07-10T00:00:00.000Z'),
      userId: 1001
    },
    {
      categoryId: 102,
      name: 'Travel Expenses',
      description: 'Business travel costs',
      dateCreated: new Date('2025-07-11T00:00:00.000Z'),
      userId: 1001
    },
    {
      categoryId: 103,
      name: 'Meals & Entertainment',
      description: 'Food and client entertainment',
      dateCreated: new Date('2025-07-12T00:00:00.000Z'),
      userId: 1001
    }
  ];

  beforeEach(async () => {
    const categoriesServiceSpy = jasmine.createSpyObj('CategoriesService', ['getAllCategoriesByUserId']);

    await TestBed.configureTestingModule({
      imports: [CategoryByIdComponent, ReactiveFormsModule],
      providers: [
        { provide: CategoriesService, useValue: categoriesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryByIdComponent);
    component = fixture.componentInstance;
    mockCategoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
  });

  it('should show dropdown when categories are loaded', () => {
    mockCategoriesService.getAllCategoriesByUserId.and.returnValue(of(mockCategories));

    component.ngOnInit();
    fixture.detectChanges();

    // Check that form is displayed
    const formElement = fixture.nativeElement.querySelector('#categorySelect');
    expect(formElement).toBeTruthy();

    // Check that empty categories message is NOT shown
    const emptyMessage = fixture.nativeElement.querySelector('.no-category span');
    const hasEmptyMessage = emptyMessage && emptyMessage.textContent.includes('There is nothing to update');
    expect(hasEmptyMessage).toBeFalsy();
  });

  it('should show empty state when no categories exist', () => {
    mockCategoriesService.getAllCategoriesByUserId.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    // Check that empty message is shown
    const emptyMessage = fixture.nativeElement.querySelector('.no-category');
    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage.textContent).toContain('There is nothing to update');

    // Check that form is NOT displayed
    const formElement = fixture.nativeElement.querySelector('#categorySelect');
    expect(formElement).toBeFalsy();
  });

  it('should find and display selected category when form is submitted', () => {
    mockCategoriesService.getAllCategoriesByUserId.and.returnValue(of(mockCategories));
    component.ngOnInit();
    fixture.detectChanges();

    // Set form value to select the first category
    component.categoryForm.patchValue({ selectedCategoryId: '101' });
    expect(component.categoryForm.valid).toBeTruthy();

    // Submit the form
    component.onSubmit();
    fixture.detectChanges();

    expect(component.selectedCategoryData).toEqual(mockCategories[0]);

    // Check that category details table is displayed
    const table = fixture.nativeElement.querySelector('.category-page__table');
    expect(table).toBeTruthy();

    // Check table headers
    const headers = table.querySelectorAll('.category-page__table-header');
    expect(headers.length).toBe(4);
    expect(headers[0].textContent.trim()).toBe('Category');
    expect(headers[1].textContent.trim()).toBe('Amount');
    expect(headers[2].textContent.trim()).toBe('Description');
    expect(headers[3].textContent.trim()).toBe('Date Created');

    // Check table cells content
    const cells = table.querySelectorAll('.category-page__table-cell');
    expect(cells[0].textContent.trim()).toBe('Office Supplies'); // name
    expect(cells[1].textContent.trim()).toBe('101'); // categoryId
    expect(cells[2].textContent.trim()).toBe('Items for office use'); // description
    expect(cells[3].textContent.trim()).toContain('Jul'); // dateCreated with date pipe

    // Check that "please select" message is not shown
    const pleaseSelectMessage = fixture.nativeElement.querySelector('.no-category');
    expect(pleaseSelectMessage).toBeFalsy();
  });

  it('should handle empty categories and invalid form submissions', () => {
    // Test with empty categories array
    mockCategoriesService.getAllCategoriesByUserId.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.userCategories).toEqual([]);

    // Check that no-category message is shown when no categories exist
    const noCategoryMessage = fixture.nativeElement.querySelector('.no-category');
    expect(noCategoryMessage).toBeTruthy();
    expect(noCategoryMessage.textContent.trim()).toContain('There is nothing to update, try adding some categories!');

    // Check that form is not displayed
    const formElement = fixture.nativeElement.querySelector('#categorySelect');
    expect(formElement).toBeFalsy();

    // Test invalid form submission
    mockCategoriesService.getAllCategoriesByUserId.and.returnValue(of(mockCategories));
    component.ngOnInit();

    // Try submitting with empty form (invalid)
    component.categoryForm.patchValue({ selectedCategoryId: '' });
    expect(component.categoryForm.valid).toBeFalsy();

    component.onSubmit();
    expect(component.selectedCategoryData).toBeNull();

    // Test with non-existent category ID
    component.categoryForm.patchValue({ selectedCategoryId: '999' });
    component.onSubmit();
    expect(component.selectedCategoryData).toBeNull();

    fixture.detectChanges();

    // Check that "please select" message is shown when no category is selected
    const pleaseSelectMessage = fixture.nativeElement.querySelector('.no-category');
    expect(pleaseSelectMessage).toBeTruthy();
    expect(pleaseSelectMessage.textContent.trim()).toContain('Please select a category to view details.');
  });
});
