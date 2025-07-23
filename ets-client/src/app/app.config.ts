import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './security/auth.interceptor';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [

    importProvidersFrom(QuillModule.forRoot({
      modules: {
        toolbar: [
          ['clean'],
          [{ 'font': [] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'align': [] },{ 'indent': '-1'},{ 'indent': '+1' }],
          [{ 'color': [] }, { 'background': [] }],
          [
            'bold', 'italic', 'underline', 'blockquote', 'strike',
            { 'script': 'sub'}, { 'script': 'super' }
          ],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
          ['link', 'image', 'video','code-block']
        ]
      }
    })),

    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    provideAnimations(),

    provideHttpClient(),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

  ]
};
