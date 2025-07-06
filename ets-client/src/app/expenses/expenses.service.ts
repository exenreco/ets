import { Expenses } from './expenses';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../security/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(private http: HttpClient) { }

  getExpenses() {
    return this.http.get<Expenses[]>(`${environment.apiBaseUrl}/api/expenses`);
  }

  getExpensesWithCategory() {
    return this.http.get<Expenses[]>(`${environment.apiBaseUrl}/api/expenses/ToName`);
  }
}
