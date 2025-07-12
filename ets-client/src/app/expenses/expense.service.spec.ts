import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { Expense, ExpensesService } from './expenses.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController,  provideHttpClientTesting } from '@angular/common/http/testing';

describe('ExpensesService', () => {
  let expensesService: ExpensesService, httpMock: HttpTestingController;

  beforeEach(async () => {

    TestBed.configureTestingModule({

      imports: [],

      providers: [
        ExpensesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]

    });

    httpMock = TestBed.inject(HttpTestingController);

    expensesService = TestBed.inject(ExpensesService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('└── should create the Expenses Service', () => {
    expect(expensesService).toBeTruthy();
  });

  it('└── should allow users to add a new expense', () => {
    const mockReq:  Expense[] = [{
      date:           'January 12, 2025',
      userId:         202303,
      amount:         '15.99',
      expenseId:      4000045,
      categoryId:     5000055,
      description:    'Car wash',
      dateCreated:    'January 12, 2025',
      dateModified:   'January 12, 2025',
    }];

    spyOn(expensesService, 'addExpense').and.returnValue(of(mockReq));

    let result: Expense[] | undefined;

    expensesService.addExpense(mockReq[0]).subscribe(res => result = res);

    expect(expensesService.addExpense).toHaveBeenCalledWith(mockReq[0]);// Assert that the spy was called

    expect(result).toEqual(mockReq); // And assert that the result matches
  });

  it('└── should update an existing expense', () => {
    const
    mockReq:  Expense[] = [{
      date:           'January 12, 2025',
      userId:         202303,
      amount:         '15.99',
      expenseId:      4000045,
      categoryId:     5000055,
      description:    'Car wash',
      dateCreated:    'January 12, 2025',
      dateModified:   'January 12, 2025',
    }];

    spyOn(expensesService, 'updateExpense').and.returnValue(of(mockReq));

    let result: Expense[] | undefined;

    expensesService.updateExpense(mockReq[0]).subscribe(res => result = res);

    expect(expensesService.updateExpense).toHaveBeenCalledWith(mockReq[0]);

    expect(result).toEqual(mockReq);
  });

  it('└── should get all expense by user id', () => {
    const
    mockRes:  Expense[] = [{
      date:           'January 12, 2025',
      userId:         202303,
      amount:         '15.99',
      expenseId:      4000045,
      categoryId:     5000055,
      description:    'Car wash',
      dateCreated:    'January 12, 2025',
      dateModified:   'January 12, 2025',
    },
    {
      date:           'January 12, 2025',
      userId:         202303,
      amount:         '15.99',
      expenseId:      4000045,
      categoryId:     5000055,
      description:    'Paint Car',
      dateCreated:    'January 12, 2025',
      dateModified:   'January 12, 2025',
    }];

    spyOn(expensesService, 'getAllExpensesByUserId').and.returnValue(of(mockRes));

    let result: Expense[] | undefined;

    expensesService.getAllExpensesByUserId().subscribe(res => result = res);

    expect(expensesService.getAllExpensesByUserId).toHaveBeenCalledWith();

    expect(result).toEqual(mockRes);
  });
});
