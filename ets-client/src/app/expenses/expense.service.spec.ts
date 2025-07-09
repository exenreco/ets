import { TestBed } from '@angular/core/testing';
import { ExpensesService } from './expenses.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // <-- Add this!
      providers: [ExpensesService]
    });

    service = TestBed.inject(ExpensesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*it('should fetch expenses via GET', () => {
    const mockExpenses = [
      {
        _id: '1',
        userId: 1,
        categoryId: 'Food',
        amount: 10,
        description: 'Lunch',
        date: '2025-07-01',
        dateCreated: '2025-07-01T12:00:00Z',
        dateModified: '2025-07-01T12:00:00Z'
      }
    ];
    service.getExpenses().subscribe(expenses => {
      expect(expenses).toEqual(mockExpenses);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/expenses`);
    expect(req.request.method).toBe('GET');
    req.flush(mockExpenses);
  });*/
});
