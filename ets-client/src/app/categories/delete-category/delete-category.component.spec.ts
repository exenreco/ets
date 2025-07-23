import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DeleteCategoryComponent } from './delete-category.component';
import { CategoriesService, Category } from '../categories.service';
import { CommonModule } from '@angular/common';
import { ExpensesService } from '../../expenses/expenses.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

describe('DeleteCategoryComponent', () => {
  let component: DeleteCategoryComponent;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<DeleteCategoryComponent>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;
  let expensesService: jasmine.SpyObj<ExpensesService>;
  let  router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;

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
    routerEvents$ = new Subject();

    const
      routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
        events: routerEvents$.asObservable(),
        routerState: { snapshot: {} }
      }),
      categorySpy = jasmine.createSpyObj('CategoriesService', [
        'getAllCategoriesByUserId',
        'deleteCategory'
      ]),
      expensesSpy = jasmine.createSpyObj('ExpensesService', [
        'getAllExpenses',
        'deleteExpenseByUserId',
        'getAllExpensesByUserId',
        'getUserExpensesWithCatName',
      ]),
      activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild'])
    ;
    categorySpy.getAllCategoriesByUserId.and.returnValue(of([]));

    categorySpy.deleteCategory.and.returnValue(of('success'));

    expensesSpy.getUserExpensesWithCatName.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DeleteCategoryComponent, ReactiveFormsModule, CommonModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: CategoriesService, useValue: categorySpy },
        { provide: ExpensesService, useValue: expensesSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpMock = TestBed.inject(HttpTestingController);
    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
    expensesService = TestBed.inject(ExpensesService) as jasmine.SpyObj<ExpensesService>;

    fixture = TestBed.createComponent(DeleteCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and load user categories on init', () => {
    categoriesService.getAllCategoriesByUserId.and.returnValue(of(mockCategories));

    component.ngOnInit();

    expect(component).toBeTruthy();
    expect(categoriesService.getAllCategoriesByUserId).toHaveBeenCalled();
    expect(component.userCategories).toEqual(mockCategories);
  });

  it('should select category and display details when form is submitted', () => {
    component.userCategories = mockCategories;

    // Set form value
    component.deleteCategoryForm.patchValue({ categoryId: '1' });

    expect(component.selectedCategoryData).toEqual(mockCategories[0]);
    expect(component.selectedCategoryData?.categoryId).toEqual(mockCategories[0].categoryId);
    expect(component.selectedCategoryData?.name).toBe('Food');
  });

  it('should successfully delete category and refresh data', () => {
    // Setup initial data
    component.userCategories = mockCategories;
    component.selectedCategoryData = mockCategories[0];

    // Mock successful deletion - fix the return type here
    categoriesService.deleteCategory.and.returnValue(of(undefined as any));
    categoriesService.getAllCategoriesByUserId.and.returnValue(of([mockCategories[1]])); // Return remaining category
    component.onDelete();
    expect(component.selectedCategoryData).toEqual(mockCategories[0]);
    expect(categoriesService.getAllCategoriesByUserId).toHaveBeenCalledTimes(1);
  });
});
