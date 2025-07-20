//import { Expenses } from './expenses';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../security/auth.service';
import { environment } from '../../environments/environment';
import { CategoriesService } from '../categories/categories.service';

export interface Expense {
  date:           string;
  userId:         number;
  amount:         string;
  expenseId?:     number;
  categoryId:     number;
  description:    string;
  dateCreated?:   string;
  dateModified?:  string;
}

// used to display expenses with category name instead of Id
export interface ExpenseWithCategoryName extends Expense {
  categoryName?: string;
}

export interface CategoryTotal {
  name: string;
  value: number;
}

export interface ExpenseSearchFilters {
  filter?:      string;
  endDate?:     Date;
  startDate?:   Date;
  minAmount?:   number;
  maxAmount?:   number;
  categoryId?:  number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})

export class ExpensesService {

  // The userId of the logged in user
  currentUser = this.authService.getUserId();

  // is the current user authenticated
  isAuthenticated = this.authService.isAuthenticated();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private categoriesService: CategoriesService
  ) {}

  // Fetches all expenses in the database
  getAllExpenses(): Observable<Expense[]>{
    return this.http
      .get<Expense[]>(`${environment.apiBaseUrl}/api/expenses`)
      .pipe(catchError(error => {
        console.error('Error fetching expenses by id:', error);
        return of([]);
      }));
  }

  // Fetches all expenses by userId
  getAllExpensesByUserId(): Observable<Expense[]> {
    return this.http
      .get<Expense[]>(`${environment.apiBaseUrl}/api/expenses/user/${encodeURI(this.currentUser)}`)
      .pipe(catchError(error => {
        console.error('Error fetching expenses by id:', error);
        return of([]);
      }));
  }

  // Fetches all expenses by userId and appends category name
  getUserExpensesWithCatName(): Observable<ExpenseWithCategoryName[]> {
    return this.getAllExpensesByUserId().pipe<Expense[]>(switchMap(expenses => {

      if (!expenses.length) return of([] as ExpenseWithCategoryName[]);

      const enriched$ = expenses.map(exp =>
        this.categoriesService
          .getCategoryNameById(exp.categoryId) // Observable<string>
          .pipe( map(name => ({ ...exp, categoryName: name })) )
      );

      return forkJoin(enriched$);
    }));
  }

  // add a new expense
  addExpense( expense:Expense ): Observable<Expense[]>{
    return this.http
      .post<Expense[]>(`${environment.apiBaseUrl}/api/expenses/add-expense`, {...expense})
      .pipe(
        tap(response => {
          if(response) return response;
          else return of([]);
        })
      );
  }

  // update existing expense
  updateExpense( expense:Expense ): Observable<Expense[]>{
    if (!expense.expenseId) return of([]);
    else return this.http
      .put<Expense[]>(`${environment.apiBaseUrl}/api/expenses/${expense.expenseId}`, {...expense})
      .pipe(
        tap(response => {
          if(response) return response;
          else return of([]);
        })
      );
  }

  searchExpenses(filters: ExpenseSearchFilters ): Observable<Expense[]> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<Expense[]>(`${environment.apiBaseUrl}/api/expenses/${this.currentUser}`, { params });
  }
}
