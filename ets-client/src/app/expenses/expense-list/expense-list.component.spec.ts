import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExpenseListComponent } from './expense-list.component';
import { ExpensesService } from '../expenses.service';
import { of, throwError } from 'rxjs';
import { Expenses } from '../expenses';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExpenseListComponent', () => {
  let component: ExpenseListComponent;
  let fixture: ComponentFixture<ExpenseListComponent>;
  let mockExpensesService: jasmine.SpyObj<ExpensesService>;

  const mockExpenses: Expenses[] = [
    {
      _id: '1',
      userId: 1,
      categoryName: 'Food',
      categoryId: 3,
      amount: 50,
      description: 'Lunch at restaurant',
      date: '2023-10-01',
      dateCreated: '2023-10-01T12:00:00Z',
      dateModified: '2023-10-01T12:00:00Z'
    },
    {
      _id: '2',
      userId: 1,
      categoryName: 'Transport',
      categoryId: 4,
      amount: 20,
      description: 'Bus ticket',
      date: '2023-10-02',
      dateCreated: '2023-10-02T12:00:00Z',
      dateModified: '2023-10-02T12:00:00Z'
    }
  ];

  beforeEach(waitForAsync(() => {
    mockExpensesService = jasmine.createSpyObj('ExpensesService', ['getExpenses', 'getExpensesWithCategory']);
    mockExpensesService.getExpensesWithCategory.and.returnValue(of(mockExpenses));

    TestBed.configureTestingModule({
      imports: [ExpenseListComponent],
      providers: [{ provide: ExpensesService, useValue: mockExpensesService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockExpensesService.getExpenses.and.returnValue(of(mockExpenses));
    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display a table of expenses when expenses exist', () => {
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('.expense-page__table-row'));
    const firstDataRow = rows[1]; // row[0] is the header
    const cells = firstDataRow.queryAll(By.css('.expense-page__table-cell'));
    expect(cells[1].nativeElement.textContent).toContain('Food');
  });

  it('should display "No expenses found." when the expenses array is empty', () => {
    mockExpensesService.getExpensesWithCategory.and.returnValue(of([]));
    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const msg = fixture.debugElement.query(By.css('.expense-page__no-expenses'));
    expect(msg?.nativeElement.textContent).toContain('No expenses found.');
  });

  // Optional: error handling (not requested, but useful)
  it('should set errorMessage if getExpenses throws error', () => {
    const error = { message: 'Failed to load' };
    mockExpensesService.getExpenses.and.returnValue(throwError(() => error));
    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Failed to load');
  });
});
