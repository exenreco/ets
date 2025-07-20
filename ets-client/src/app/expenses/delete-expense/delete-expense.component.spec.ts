import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteExpenseComponent } from './delete-expense.component';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../security/auth.service';
import { ExpensesService, ExpenseWithCategoryName } from '../expenses.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CategoriesService } from '../../categories/categories.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('DeleteExpenseComponent', () => {
  let
  component: DeleteExpenseComponent,
  fixture: ComponentFixture<DeleteExpenseComponent>,
  expensesService: jasmine.SpyObj<ExpensesService>,
  authService: jasmine.SpyObj<AuthService>,
  httpMock: HttpTestingController,
  router: jasmine.SpyObj<Router>,
  routerEvents$: Subject<any>;

  beforeEach(async () => {

    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getUserId']);

        routerEvents$ = new Subject();

        const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
          events: routerEvents$.asObservable(),
          routerState: { snapshot: {} }
        });
        routerSpy.createUrlTree.and.returnValue({} as any);
        routerSpy.serializeUrl.and.returnValue('');

        const
          activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']),

          expensesSpy = jasmine.createSpyObj('ExpensesService', [
            'getAllExpenses',
            'deleteExpenseByUserId',
            'getAllExpensesByUserId',
            'getUserExpensesWithCatName',
          ])
        ;
      expensesSpy.getUserExpensesWithCatName.and.returnValue(of([{
        date:         '2023-10-01',
        userId:       2000000,
        amount:       '50.00',
        expenseId:    30034,
        categoryId:   405055,
        description: 'Lunch at restaurant',
        categoryName: 'Food',
        dateModified: '2023-10-01'
      }, {
        date:         '2023-10-02',
        userId:       1005654,
        amount:       '20.00',
        expenseId:    90034,
        categoryId:   675675,
        description:  'Bus ticket',
        categoryName: 'Transport',
        dateModified: '2023-10-01'
      }]));

    await TestBed.configureTestingModule({
      imports: [DeleteExpenseComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
        { provide: ExpensesService, useValue: expensesSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);
    expensesService = TestBed.inject(ExpensesService) as jasmine.SpyObj<ExpensesService>;

    fixture = TestBed.createComponent(DeleteExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('└── should create the delete expense component', () => {
    expect(component).toBeTruthy();
  });

  it('└── should display an error when a user has no expense', () => {
    const mockExpense: ExpenseWithCategoryName[] = [];

      expensesService.getUserExpensesWithCatName.and.returnValue(of([...mockExpense]));

      component.userExpenses=  [...mockExpense];

      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('.no-expense'));

      expect(errorEl.nativeElement.textContent).toContain(
        'There is nothing to delete, try adding some expenses!'
      );
  });

  it('└── should display details of the selected expenses', () => {

      const mockExpense: ExpenseWithCategoryName[] = [{
        date: 'Jan, 23, 3025',
        userId: 10001,
        amount: '12.99',
        expenseId: 50002,
        categoryId: 600034,
        categoryName: 'Food',
        description: 'Grocery'
      }];

      expensesService.getUserExpensesWithCatName.and.returnValue(of([...mockExpense]));

      component.userExpenses =  [...mockExpense];

      component.selectedExpenseData = mockExpense[0];

      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('.delete-fields-container'));

      expect(errorEl.nativeElement).toBeTruthy();
    });

    it('└── should display a list that allows users to chooses the expense to delete', () => {
      const mockExpense: ExpenseWithCategoryName[] = [{
        date: 'Jan, 23, 3025',
        userId: 10001,
        amount: '12.99',
        expenseId: 50002,
        categoryId: 600034,
        categoryName: 'Food',
        description: 'Grocery'
      }];

      expensesService.getAllExpensesByUserId.and.returnValue(of([...mockExpense]));

      component.userExpenses=  [...mockExpense];

      fixture.detectChanges();

      const

      selectEl = fixture.debugElement.query(By.css('#expenseId')),

      optionOne = selectEl.queryAll(By.css('.expense-option'));

      expect(optionOne[1].nativeElement.textContent).toContain(
        `ID #: ${mockExpense[0].expenseId} - ${mockExpense[0].description}`
      );
    });
});
