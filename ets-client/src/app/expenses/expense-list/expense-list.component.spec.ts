import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExpenseListComponent } from './expense-list.component';
import { ExpensesService, Expense} from '../expenses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController,  provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../security/auth.service';
import { CategoriesService } from '../../categories/categories.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExpenseListComponent', () => {
  let component: ExpenseListComponent;
  let fixture: ComponentFixture<ExpenseListComponent>;
  let expensesService: jasmine.SpyObj<ExpensesService>;
  let authService: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getUserId']);

    routerEvents$ = new Subject();
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEvents$.asObservable(),
      routerState: { snapshot: {} }
    });

    const activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']);

    const categoriesSpy = jasmine.createSpyObj('CategoriesService', ['getCategoriesByUserId', 'getAllExpenses()']);

    const expensesSpy = jasmine.createSpyObj('ExpensesService', [
      'getCategoriesByUserId', 'getAllExpenses', 'getUserExpensesWithCatName'
    ]);

    await TestBed.configureTestingModule({
      imports: [ExpenseListComponent],
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

    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(false);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display a table of expenses when expenses exist', () => {
    expensesService.getUserExpensesWithCatName.and.returnValue(of([{
      userId: 1,
      amount: 50,
      categoryId: '9',
      description: 'Lunch at restaurant',
      date: '2023-10-01',
      categoryName: 'Food',
    }, {
      userId: 1,
      amount: 20,
      categoryId: '10',
      description: 'Bus ticket',
      date: '2023-10-02',
      categoryName: 'Transport',
    }]));

    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('.expense-page__table-row'));
    const firstDataRow = rows[1]; // row[0] is the header
    const cells = firstDataRow.queryAll(By.css('.expense-page__table-cell'));
    expect(cells[1].nativeElement.textContent).toContain('Food');
  });

  it('should display "No expenses found." when the expenses array is empty', () => {
    expensesService.getUserExpensesWithCatName.and.returnValue(of([]));
    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const msg = fixture.debugElement.query(By.css('.expense-page__no-expenses'));
    expect(msg?.nativeElement.textContent).toContain('No expenses found.');
  });

  // Optional: error handling (not requested, but useful)
  it('should set errorMessage if getExpenses throws error', () => {
    const error = { message: 'Failed to load' };
    expensesService.getUserExpensesWithCatName.and.returnValue(throwError(() => error));
    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Failed to load');
  });
});
