import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgottenUsernameComponent } from './forgotten-username.component';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';

describe('ForgottenUsernameComponent', () => {
  let component: ForgottenUsernameComponent;
  let fixture: ComponentFixture<ForgottenUsernameComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    routerEvents$ = new Subject();
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEvents$.asObservable(),
      routerState: { snapshot: {} }
    });

    const activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']);

    await TestBed.configureTestingModule({
      imports: [
        ForgottenUsernameComponent,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore routerLink and other unknown elements
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(ForgottenUsernameComponent);
    component = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect authenticated users to dashboard on init', () => {
    authService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not redirect unauthenticated users', () => {
    authService.isAuthenticated.and.returnValue(false);
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  /*it('should have a link back to signin page', () => {
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('a.return_home'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('Back to sign in');
  });*/
});
