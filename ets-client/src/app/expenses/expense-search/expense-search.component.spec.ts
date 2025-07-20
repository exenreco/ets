import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSearchComponent } from './expense-search.component';
import { Expense, ExpensesService } from '../expenses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('ExpenseSearchComponent', () => {
  let component: ExpenseSearchComponent;
  let fixture: ComponentFixture<ExpenseSearchComponent>;
  let expensesService: jasmine.SpyObj<ExpensesService>;
  let router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
      events: routerEvents$.asObservable(),
      routerState: { snapshot: {} }
    });
    routerSpy.createUrlTree.and.returnValue({} as any);
    routerSpy.serializeUrl.and.returnValue('');

    const activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']);

    const expensesSpy = jasmine.createSpyObj('ExpensesService', [
      'getAllExpenses',
      'searchExpenses',
      'getUserExpensesWithCatName'
    ]);

    expensesSpy.searchExpenses.and.returnValue(of([{
      date: 'Jan, 23, 3025',
      userId: 10001,
      amount: '12.99',
      expenseId: 50002,
      categoryId: 600034,
      description: 'Grocery'
    }]));

    await TestBed.configureTestingModule({
      imports: [ExpenseSearchComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: ExpensesService, useValue: expensesSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ],
    })
    .compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    expensesService = TestBed.inject(ExpensesService) as jasmine.SpyObj<ExpensesService>;

    fixture = TestBed.createComponent(ExpenseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('└── should create the search expense component', () => {
    expect(component).toBeTruthy();
  });

  it('└── should display the expense search form', () => {
    const formEl = fixture.debugElement.query(By.css('.searchExpenseForm'));
    expect(formEl.nativeElement).toBeTruthy();
  });

  it('└── should allow users to filter expenses by description', () => {
    const mockResult: Expense[] = [{
      date: 'Jan, 23, 3025',
      userId: 10001,
      amount: '12.99',
      expenseId: 50002,
      categoryId: 600034,
      description: 'Grocery'
    }]
    component.selectFilter('description');
    component.searchExpenseForm.controls['description'].patchValue('Grocery');
    fixture.detectChanges();

    component.onSearch();
    fixture.detectChanges();

    expect(component.results).toEqual(mockResult);
  });

  it('└── should allow users to filter expenses by category', () => {
    const mockResult: Expense[] = [{
      date: 'Jan, 23, 3025',
      userId: 10001,
      amount: '12.99',
      expenseId: 50002,
      categoryId: 600034,
      description: 'Grocery'
    }]
    component.selectFilter('category');
    component.searchExpenseForm.controls['description'].patchValue('600034');
    fixture.detectChanges();

    component.onSearch();
    fixture.detectChanges();

    expect(component.results).toEqual(mockResult);
  });
});
