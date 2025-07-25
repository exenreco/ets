import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { AuthService } from '../security/auth.service';
import { environment } from '../../environments/environment';

export interface Category {
  name?:        string;
  slug?:        string;
  userId:       number;
  categoryId:   number;
  description?: string;
  dateCreated?: Date;
  dateModified?: Date;
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
      .get<Category[]>(`${environment.apiBaseUrl}/api/categories?userId=${encodeURI(this.userId)}`)
      .pipe(catchError(err => {
          console.error('Error fetching categories:', err);
          return of([]); // Return empty array on error
      }));
    else return of([]); // Return empty array on error
  }

  // add a new expense category
  addCategory( category:Category ): Observable<Category[]>{
    return this.http
      .post<Category[]>(`${environment.apiBaseUrl}/api/categories/add-category`, {...category})
      .pipe(
        tap(response => {
          if(response) return response;
          else return of([]);
        })
      );
  }

  // update existing category
  updateCategory( category:Category ): Observable<Category[]>{
    if (!category.categoryId) return of([]);
    else return this.http
      .put<Category[]>(`${environment.apiBaseUrl}/api/categories/${category.categoryId}`, {...category})
      .pipe(
        tap(response => {
          if(response) return response;
          else return of([]);
        })
      );
  }

  // delete a category by id
  deleteCategory(categoryId: number): Observable<Category[]> {
    return this.http
      .delete<Category[]>(`${environment.apiBaseUrl}/api/categories/${categoryId}`)
      .pipe(
        tap(response => {
          if(response) return response;
          else return of([]);
        }),
        catchError(error => {
          console.error('Error deleting category:', error);
          return of([]);
        })
      );
  }
}
