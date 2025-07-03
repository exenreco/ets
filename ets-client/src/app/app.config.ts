import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { provideHttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './security/auth.interceptor';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [

    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    provideHttpClient(),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ]
};
