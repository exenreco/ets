import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewComponent } from './overview.component';
import { AuthService } from '../../../security/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { CategoriesService } from '../../../categories/categories.service';
import { Expense, ExpensesService, ExpenseWithCategoryName } from '../../../expenses/expenses.service';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let expensesService: jasmine.SpyObj<ExpensesService>;
  let authService: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;

  const mockExpense: Expense[] = [{
    date: 'Jan, 23, 3025',
    userId: 10001,
    amount: '12.99',
    expenseId: 50002,
    categoryId: 600034,
    description: 'Grocery'
  },{
    date: 'Jan, 23, 3025',
    userId: 10001,
    amount: '12.99',
    expenseId: 50002,
    categoryId: 600034,
    description: 'Grocery'
  }];
  const mockExpenseWithCat: ExpenseWithCategoryName[] = [{
    date: 'Jan, 23, 3025',
    userId: 10001,
    amount: '12.99',
    expenseId: 50002,
    categoryId: 600034,
    description: 'Grocery',
    categoryName: 'Food'
  },{
    date: 'Jan, 23, 2025',
    userId: 10001,
    amount: '2.00',
    expenseId: 50002,
    categoryId: 600034,
    description: 'Grocery',
    categoryName: 'Food'
  }];

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getUserId',
      'getFirstName'
    ]);

    routerEvents$ = new Subject();

    const routerSpy = jasmine.createSpyObj('Router', [
      'navigate',
      'createUrlTree',
      'serializeUrl'
    ], {
      events: routerEvents$.asObservable(),
      routerState: { snapshot: {} }
    });
    routerSpy.createUrlTree.and.returnValue({} as any);
    routerSpy.serializeUrl.and.returnValue('');

    const activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']);

    const categoriesSpy = jasmine.createSpyObj('CategoriesService', [
      'getCategoryNameById',
      'getAllCategoriesByUserId'
    ]);

    categoriesSpy.getAllCategoriesByUserId.and.returnValue(of([
      { name: 'Food', categoryId: 243545, description: 'Grocery' },
      { name: 'Rent', categoryId: 243545, description: 'utilities' }
    ]));

    const expensesSpy = jasmine.createSpyObj('ExpensesService', [
      'getAllExpenses',
      'getUserExpensesWithCatName',
      'getAllExpensesByUserId'
    ]);

    await TestBed.configureTestingModule({
      imports: [OverviewComponent],
      providers: [
        provideAnimations(),
        provideHttpClientTesting(),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: AuthService, useValue: authSpy },
        { provide: CategoriesService, useValue: categoriesSpy },
        { provide: ExpensesService, useValue: expensesSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore routerLink and other unknown elements
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);
    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
    expensesService = TestBed.inject(ExpensesService) as jasmine.SpyObj<ExpensesService>;


    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(false);
    authService.getFirstName.and.returnValue(of('Alice'));
    expensesService.getAllExpensesByUserId.and.returnValue(of([...mockExpense]));
    expensesService.getUserExpensesWithCatName.and.returnValue(of([...mockExpenseWithCat]));
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('└── should create the overview component', () => {
    expect(component).toBeTruthy();
  });

  it('└── should set username from AuthService', () => {
    expect(component.username).toBe('Alice');
  });

  it('└── should calculate lifetimeExpenses, oldestExpenseDate, and newestExpenseDate correctly', () => {
    // Lifetime total: 3.50 + 12.00 = 15.50
    expect(component.lifetimeExpenses).toContain('$25.98');
    expect(component.oldestExpenseDate).toBe('January 3025');
    expect(component.newestExpenseDate).toBe('January 3025');
  });

  it('└── should build categoryTotal from ExpenseWithCategoryName', () => {
    const expected = [{ name: 'Food', value: 14.99 }];
    expect(component.categoryTotal).toEqual(expected);
  });
});
