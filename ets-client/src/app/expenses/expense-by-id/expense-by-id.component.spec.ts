import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ExpenseByIdComponent } from './expense-by-id.component';
import { ExpensesService, ExpenseWithCategoryName } from '../expenses.service';

describe('ExpenseByIdComponent', () => {
  let component: ExpenseByIdComponent;
  let fixture: ComponentFixture<ExpenseByIdComponent>;
  let mockExpensesService: jasmine.SpyObj<ExpensesService>;

  const mockExpenses: ExpenseWithCategoryName[] = [
  {
    expenseId: 10299,
    userId: 1001,
    categoryId: 456,
    amount: '150.75',
    description: 'Office supplies',
    date: '2025-07-10T00:00:00.000Z',
    categoryName: 'Business'
  },
  {
    userId: 1001,
    expenseId: 10293,
    categoryId: 789,
    amount: '75.50',
    description: 'Lunch meeting',
    date: '2025-07-11T00:00:00.000Z',
    categoryName: 'Food'
  }
  ];

  beforeEach(async () => {
    const expensesServiceSpy = jasmine.createSpyObj('ExpensesService', ['getUserExpensesWithCatName']);

    await TestBed.configureTestingModule({
      imports: [ExpenseByIdComponent, ReactiveFormsModule],
      providers: [
        { provide: ExpensesService, useValue: expensesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseByIdComponent);
    component = fixture.componentInstance;
    mockExpensesService = TestBed.inject(ExpensesService) as jasmine.SpyObj<ExpensesService>;
  });

  it('should create and initialize component with empty form', () => {
    mockExpensesService.getUserExpensesWithCatName.and.returnValue(of([]));

    expect(component).toBeTruthy();
    expect(component.userExpenses).toEqual([]);
    expect(component.selectedExpenseData).toBeNull();
    expect(component.expenseForm.get('selectedExpenseId')?.value).toBe('');
    expect(component.expenseForm.valid).toBeFalse();
  });

  it('should load user expenses on ngOnInit and populate dropdown', () => {
    mockExpensesService.getUserExpensesWithCatName.and.returnValue(of(mockExpenses));

    component.ngOnInit();
    fixture.detectChanges();

    expect(mockExpensesService.getUserExpensesWithCatName).toHaveBeenCalled();
    expect(component.userExpenses).toEqual(mockExpenses);

    // Check that dropdown options are rendered
    const selectElement = fixture.nativeElement.querySelector('#expenseSelect');
    const options = selectElement.querySelectorAll('option');
    expect(options.length).toBe(3); // 1 default + 2 expenses
    expect(options[1].value).toBe('10299');
    expect(options[1].textContent.trim()).toBe('ID: 10299 - Office supplies');
    expect(options[2].value).toBe('10293');
    expect(options[2].textContent.trim()).toBe('ID: 10293 - Lunch meeting');
  });

  it('should find and display selected expense when form is submitted', () => {
    mockExpensesService.getUserExpensesWithCatName.and.returnValue(of(mockExpenses));
    fixture = TestBed.createComponent(ExpenseByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Set form value to select first expense
    component.expenseForm.patchValue({ selectedExpenseId: '10299' });
    fixture.detectChanges();

    // Submit form
    component.onSubmit();
    fixture.detectChanges();

    expect(component.selectedExpenseData).toEqual(mockExpenses[0]);

    // Check that expense details table is displayed
    const table = fixture.nativeElement.querySelector('.expense-page__table');
    expect(table).toBeTruthy();

    const cells = table.querySelectorAll('.expense-page__table-cell');
    expect(cells[0].textContent.trim()).toContain('10299'); // id
    expect(cells[1].textContent.trim()).toBe('Office supplies'); // description
    expect(cells[2].textContent.trim()).toBe('$150.75'); // amount
    expect(cells[3].textContent.trim()).toBe('Business'); // category name
    expect(cells[4].textContent.trim()).toContain('Jul'); // Date with date pipe
  });

  it('should handle form submission with invalid selection and show appropriate messages', () => {
    // Test invalid form submission
    component.expenseForm.patchValue({ selectedExpenseId: '' });
    component.onSubmit();

    expect(component.selectedExpenseData).toBeNull();

    // Test with valid form but non-existent expense ID
    mockExpensesService.getUserExpensesWithCatName.and.returnValue(of(mockExpenses));
    component.ngOnInit();

    component.expenseForm.patchValue({ selectedExpenseId: 'non-existent-id' });
    component.onSubmit();
    fixture.detectChanges();

    expect(component.selectedExpenseData).toBeNull();

    // Check that "Please select an expense" message is shown when no expense is selected
    const noSelectionMessage = fixture.nativeElement.querySelector('.no-expense');
    expect(noSelectionMessage).toBeTruthy();
    expect(noSelectionMessage.textContent.trim()).toContain('Please select an expense to view details');

    // Test no expenses available scenario
    mockExpensesService.getUserExpensesWithCatName.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();

    // Verify no expenses message is shown when no expenses are loaded
    const noExpensesMessage = fixture.nativeElement.querySelector('.no-expense');
    expect(noExpensesMessage).toBeTruthy();
    expect(noExpensesMessage.textContent).toContain('There is nothing to update');
  });
});
