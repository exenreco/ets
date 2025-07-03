/**
 * File: auth.gaurd.ts
 *
 * Date: July 01, 2025
 *
 * Description: Auth guard - This file is used to protect routes from unauthorized access.
 */

// Requirements
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {

  const

    authService = inject(AuthService),

    router = inject(Router); // Inject the cookie service

  if (authService.isAuthenticated()) { //is signed-in in AuthService

    return true;

  } else {

    authService.logout(); // Clear invalid tokens

    router.navigate(['/signin'], {

      queryParams: { returnUrl: state.url }

    });

    return false;
  }

};
