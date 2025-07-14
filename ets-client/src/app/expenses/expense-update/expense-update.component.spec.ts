import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseUpdateComponent } from './expense-update.component';
import { ExpensesService, Expense, ExpenseWithCategoryName} from '../expenses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController,  provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../security/auth.service';
import { CategoriesService } from '../../categories/categories.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExpenseUpdateComponent', () => {
  let component: ExpenseUpdateComponent;
  let fixture: ComponentFixture<ExpenseUpdateComponent>;
  let expensesService: jasmine.SpyObj<ExpensesService>;
  let authService: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getUserId']);

    routerEvents$ = new Subject();

    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
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
      imports: [ExpenseUpdateComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
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


    fixture = TestBed.createComponent(ExpenseUpdateComponent);
    component = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(false);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('└── should create the Expense update component', () => {
    expect(component).toBeTruthy();
  });

  it('└── should display a list that allows users to chooses the expense to update', () => {
    const mockExpense: Expense[] = [{
      date: 'Jan, 23, 3025',
      userId: 10001,
      amount: '12.99',
      expenseId: 50002,
      categoryId: 600034,
      description: 'Grocery'
    }];

    expensesService.getAllExpensesByUserId.and.returnValue(of([...mockExpense]));

    fixture = TestBed.createComponent(ExpenseUpdateComponent);

    component = fixture.componentInstance;

    component.userExpenses=  [...mockExpense];

    fixture.detectChanges();

    const

    selectEl = fixture.debugElement.query(By.css('#expenseId')),

    optionOne = selectEl.queryAll(By.css('.expense-option'));

    expect(optionOne[1].nativeElement.textContent).toContain(
      `${mockExpense[0].description} - \$${mockExpense[0].amount}`
    );
  });

  it('└── should display an error when a user has no expense', () => {
    const mockExpense: Expense[] = [];

    expensesService.getAllExpensesByUserId.and.returnValue(of([...mockExpense]));

    fixture = TestBed.createComponent(ExpenseUpdateComponent);

    component = fixture.componentInstance;

    component.userExpenses=  [...mockExpense];

    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.no-expense'));

    expect(errorEl.nativeElement.textContent).toContain(
      'There is nothing to update, try adding some expenses!'
    );
  });

  it('└── should display the update expense form fields when an expense is selected', () => {

    const mockExpense: Expense[] = [{
      date: 'Jan, 23, 3025',
      userId: 10001,
      amount: '12.99',
      expenseId: 50002,
      categoryId: 600034,
      description: 'Grocery'
    }];

    expensesService.getAllExpensesByUserId.and.returnValue(of([...mockExpense]));

    fixture = TestBed.createComponent(ExpenseUpdateComponent);

    component = fixture.componentInstance;

    component.userExpenses =  [...mockExpense];

    component.selectedExpenseData = mockExpense[0];

    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.update-fields-container'));

    expect(errorEl.nativeElement).toBeTruthy();
  });
});
