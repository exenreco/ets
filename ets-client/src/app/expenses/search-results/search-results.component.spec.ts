
import { Subject, of } from 'rxjs';
import { Expense, ExpensesService } from '../expenses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { convertToParamMap, ParamMap } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';
import { By } from '@angular/platform-browser';


describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let expensesService: jasmine.SpyObj<ExpensesService>;
  let router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;

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
    amount: '15.99',
    expenseId: 50004,
    categoryId: 600034,
    description: 'Lunch'
  }];

  beforeEach(async () => {

    routerEvents$ = new Subject();

    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
      events: routerEvents$.asObservable(),
      routerState: { snapshot: {} }
    });
    routerSpy.createUrlTree.and.returnValue({} as any);
    routerSpy.serializeUrl.and.returnValue('');

    const activatedSpy: Partial<ActivatedRoute> = {
      queryParamMap: of(convertToParamMap({ id: '123', filter: 'active' })),
      firstChild: {
        queryParamMap: of(convertToParamMap({ foo: 'bar' })),
        snapshot: { queryParamMap: convertToParamMap({ foo: 'bar' }) }
      } as ActivatedRoute
    };

    const expensesSpy = jasmine.createSpyObj('ExpensesService', [
      'getAllExpenses',
      'getUserExpensesWithCatName'
    ]);

    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        { provide: ExpensesService, useValue: expensesSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ],
    })
    .compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    expensesService = TestBed.inject(ExpensesService) as jasmine.SpyObj<ExpensesService>;

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('└── should create the search result component', () => {
    expect(component).toBeTruthy();
  });

  it('└── should display results when a query is made', () => {
    component.results = mockExpense;
    fixture.detectChanges();

    const resultsEl = fixture.debugElement.queryAll(By.css('.__result'));
    expect(resultsEl.length).toBe(2);
  });

  it('└── should display no results on invalid search', () => {
    component.results = [];
    fixture.detectChanges();

    const noResultsEl = fixture.debugElement.query(By.css('#__no_result'));
    expect(noResultsEl).toBeTruthy();
  });

  it('└── should display expense id in search result title', () => {
    component.results = mockExpense;
    fixture.detectChanges();

    const noResultsEl = fixture.debugElement.queryAll(By.css('.__widget_title'));
    expect(noResultsEl[0].nativeElement.textContent).toContain('Grocery Expense ID: #50002');
  });
});
