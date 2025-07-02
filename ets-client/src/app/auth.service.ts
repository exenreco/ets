import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

export interface User {
  userId: number;
  email: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[];
  private authState = new
  BehaviorSubject(<boolean>false);

  constructor(private cookieService: CookieService, private router: Router) {
    this.users = [
      { userId: 1000, email: "test@ets.com", username:"testuser01",  password:"test" },
      { userId: 1001, email: "exenreco@yahoo.com", username:"exenreco19",  password:"swiftly#23"},
      { userId: 1002, email: "sarageorge@ets.com", username:"Sara580",  password:"tested#13" }
    ];
   }

   getAuthState() {
    return this.authState.asObservable();
   }

   signin(email: string, username: string, password: string) {
    const user = this.users.find(user => user.email === email && user.username === username && user.password === password);

    if(user) {
      this.cookieService.set('session_user', email, 1);
      this.authState.next(true);
      return true;
    } else {
      this.authState.next(false);
      return false;
    }
   }

   signout() {
    this.cookieService.deleteAll;
    this.authState.next (false);
    this.router.navigate(['/signin']).then(() => {});
   }
}
