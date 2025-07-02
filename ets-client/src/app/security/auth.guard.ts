import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService); // Inject the cookie service

  // Check if the sessionUser cookie is set
  if (cookieService.get('sessionUser')) {
    return true; // confirms the user is logged in
  } else {
    // If the user is not logged in
    const router = inject(Router); // Inject the router service
    router.navigate(['/signin'], {queryParams: {returnUrl: state.url}}); // Redirect the user to the sign-in page
    return false; // Return false
  }
};
