import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { of, throwError } from 'rxjs';


export interface User {
  email: string;
  userId?: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string; // Optional for security reasons
  createdOn?: Date;
  modifiedOn?: Date;
}


@Injectable({
  providedIn: 'root'
})

/**
 * Auth Service
 *
 * @model src/security/auth.service.ts
 *
 * @dev Team Athene: Exenreco Bell, Sara Gorge
 *
 * @description {
 *
 *    Allows allows user to log in and out of the application,
 *    also has a method to allow uses status check.
 *
 *    NOTE: On login a response token is created containing
 *          a users user id, this token will expires after a day!
 * }
 */
export class AuthService {

  private jwtHelper = new JwtHelperService();

  constructor(

    private http: HttpClient,

     private router: Router,

    private cookieService: CookieService

  ) {}

  // log users in
  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiBaseUrl}/api/security/signin`, { username, password }).pipe(
      tap(response => {
        console.log(`token: ${response.token}`);
        // Save session on successful login
        if (response.token && response.userId && response.username ) {
          this.cookieService.set('sessionUser', response.token, 1); // Expires in 1 day
          this.cookieService.set('sessionUserId', response.userId, 1); // Expires in 1 day
          this.cookieService.set('sessionUserName', response.username, 1); // Expires in 1 day
          this.router.navigate(['/dashboard']); // Redirect to protected page
        }
      })
    );
  }

  // Check if token is valid
  isAuthenticated(): boolean {
    const token = this.cookieService.get('sessionUser');

    if (!token) return false;

    try {
      // Check expiration and validity
      return !this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      console.error('Token validation error', e);
      return false;
    }
  }

  // return the loggedIn user -> userId
  getUserId(): any {
    return this.cookieService.get('sessionUserId');
  }

  // return the loggedIn user -> username
  getUsername(): any {
    return this.http
      .get<string[]>(`${environment.apiBaseUrl}/api/users/${this.getUserId()}/username`)
      .pipe(catchError(error => {
        console.error('Error fetching username:', error);
        return of('');
      }));
  }

  // return the loggedIn user -> username
  getFirstName(): any {
    return this.http
      .get<string[]>(`${environment.apiBaseUrl}/api/users/${this.getUserId()}/first-name`)
      .pipe(catchError(error => {
        console.error('Error fetching user first name:', error);
        return of('');
      }));
  }

  // return the loggedIn user -> email
  getUserEmail(): any {
    return this.http
      .get<string[]>(`${environment.apiBaseUrl}/api/users/${this.getUserId()}/email`)
      .pipe(catchError(error => {
        console.error('Error fetching username:', error);
        return of('');
      }));
  }

  // return the loggedIn user -> email
  isValidPassword(password:string): any {
    return this.http
      .get<string[]>(`${environment.apiBaseUrl}/api/users/${this.getUserId()}?password=${password}`)
      .pipe(catchError(error => {
        console.error('Error validating password:', error);
        return of('');
      }));
  }

  // update user -> username
  patchOneUserField( data: { [key: string]: string } = { field: '', before: '', after: ''}): any {
    return this.http
      .patch(`${environment.apiBaseUrl}/api/users/${this.getUserId()}`, { ...data })
      .pipe(catchError(error => {
        console.error('Error updating user field:', error);
        return of('');
      }));
  }

  // use to reset user password
  resetPassword( params: { [key: string]: string} = {email:'',password:'',username:'',confirmPassword:''} ): any {
    return this.http
      .patch(`${environment.apiBaseUrl}/api/users/${encodeURI(params['username'])}`, { ...params })
      .pipe(catchError(error => {
        console.error('Error resetting user password:', error);
        return of({message:'Error: 500 internal server error'});
      }));
  }

  // logs users out
  logout(): void {

    // Remove all session cookie
    this.cookieService.delete('sessionUser');
    this.cookieService.delete('sessionUserId');
    this.cookieService.delete('sessionUserName');
    this.cookieService.deleteAll();

    // Redirect to sign-in page
    this.router.navigate(['signin']);

  }

  registerUser( params: User ): any {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/api/users/register`, {
        email :          params.email,
        password:        params.password,
        firstName:       params.firstName,
        lastName:        params.lastName,
        username:        params.username,
      })
      .pipe(
      catchError((error: HttpErrorResponse) => {
        // If your server returns { message: "foo" } or { validation: […] }, pick it:
        const srvMsg = typeof error.error?.message === 'string'
          ? error.error.message
          : Array.isArray(error.error?.message)
            ? error.error.message.join(', ')
            : 'Registration failed';
        // Log the raw server payload if you like
        console.error('Server error payload:', error.error);
        return throwError(() => new Error(srvMsg));
      })
    );
  }

  // Handle API errors
  handleAuthError(error: any): void {
    if (error.status === 401) this.logout();// Unauthorized
  }

}
