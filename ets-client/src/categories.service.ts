import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from './environments/environment';
import { AuthService } from './app/security/auth.service';

export interface Category { categoryId: string; name: string; }

@Injectable({ providedIn: 'root' })

export class CategoryService {

  constructor(private http: HttpClient, private authService: AuthService ) {}

  getCategoriesByUserId(): Observable<Category[]> {
    const

      userId = this.authService.getUserId(),

      isAuthenticated = this.authService.isAuthenticated()
    ;

    if( isAuthenticated && userId  ) return this.http.get<Category[]>(
          `${environment.apiBaseUrl}/api/categories/${userId}`
        ).pipe(catchError(err => {

          console.error('Error fetching categories:', err);

          return of([]); // Return empty array on error

        })

      );
    else return of([]); // Return empty array on error
  }
}
