import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddExpenseComponent } from './add-expense.component';
import { AuthService } from '../../security/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { CategoryService } from '../../categories/categories.service';

describe('AddExpenseComponent', () => {
  let component: AddExpenseComponent;
  let fixture: ComponentFixture<AddExpenseComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;
  let categoryService: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getUserId']);

    routerEvents$ = new Subject();
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEvents$.asObservable(),
      routerState: { snapshot: {} }
    });

    const activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']);

    const categorySpy = jasmine.createSpyObj('CategoryService', ['getCategoriesByUserId']);

    await TestBed.configureTestingModule({
      imports: [
        AddExpenseComponent,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
        { provide: CategoryService, useValue: categorySpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore routerLink and other unknown elements
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;

    fixture = TestBed.createComponent(AddExpenseComponent);
    component = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('should redirect authenticated users to dashboard on init', () => {
    authService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not redirect unauthenticated users', () => {
    authService.isAuthenticated.and.returnValue(false);
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });*/

  /*it('should have a link back to signin page', () => {
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('a.return_home'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('Back to sign in');
  });*/
});
