import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import { Observable, catchError, of } from 'rxjs';

export interface Category { categoryId: string; name: string; }

@Injectable({ providedIn: 'root' })

export class CategoryService {

  constructor(private http: HttpClient) {}

  getUserCategories(userId: any): Observable<Category[]> {

    return this.http

      .get<Category[]>(
        `${environment.apiBaseUrl}/api/categories` +
        `?userID=${encodeURIComponent(userId)}`
      )

      .pipe(catchError(err => {

        console.error('Error fetching categories:', err);

        return of([]); // Return empty array on error

      })

    );
  }
}
