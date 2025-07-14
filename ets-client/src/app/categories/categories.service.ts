import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from '../security/auth.service';
import { environment } from '../../environments/environment';

export interface Category {
  name?:        string;
  userId:       any;
  categoryId:   any;
  description?: string;
}

@Injectable({ providedIn: 'root' })

export class CategoriesService {

  userId: any = this.authService.getUserId();

  isAuthenticated: boolean = this.authService.isAuthenticated();

  constructor(private http: HttpClient, private authService: AuthService ) {}

  getAllCategories(): void{
  }

  getCategoryNameById( categoryId: any ): Observable<String> {
    if( this.isAuthenticated && this.isAuthenticated === true ) return this.http
      .get<String>(`${environment.apiBaseUrl}/api/categories/get-name?categoryId=${encodeURI(categoryId)}`)
      .pipe(catchError(err => {
          console.error('Error fetching categories:', err);
          return of(''); // Return empty string on error
      }));
    else return of(''); // Return empty string
  }

  getAllCategoriesByUserId(): Observable<Category[]> {
    if( this.isAuthenticated && this.isAuthenticated === true && this.userId ) return this.http
      .get<Category[]>(`${environment.apiBaseUrl}/api/categories/get-user-categories?userId=${encodeURI(this.userId)}`)
      .pipe(catchError(err => {
          console.error('Error fetching categories:', err);
          return of([]); // Return empty array on error
      }));
    else return of([]); // Return empty array on error
  }
}
