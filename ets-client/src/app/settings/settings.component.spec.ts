import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { ExpensesService } from '../expenses/expenses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController,  provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../security/auth.service';
import { CategoriesService } from '../categories/categories.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let expensesService: jasmine.SpyObj<ExpensesService>;
  let authService: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getUserId', 'getUserEmail', 'getUsername']);

    authSpy.getUserEmail.and.returnValue(of(['example@aets.com']));
    authSpy.getUsername.and.returnValue(of(['Test-user']));

    routerEvents$ = new Subject();

    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
      events: routerEvents$.asObservable(),
      routerState: { snapshot: {} }
    });
    routerSpy.createUrlTree.and.returnValue({} as any);
    routerSpy.serializeUrl.and.returnValue('');

    const activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']);

    const categoriesSpy = jasmine.createSpyObj('CategoriesService', [
      'getCategoryNameById',
      'getAllCategoriesByUserId'
    ]);

    categoriesSpy.getAllCategoriesByUserId.and.returnValue(of([
      { name: 'Food', categoryId: 243545, description: 'Grocery' },
      { name: 'Rent', categoryId: 243545, description: 'utilities' }
    ]));

    const expensesSpy = jasmine.createSpyObj('ExpensesService', [
      'getAllExpenses',
      'getUserExpensesWithCatName'
    ]);

    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
        { provide: CategoriesService, useValue: categoriesSpy },
        { provide: ExpensesService, useValue: expensesSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore routerLink and other unknown elements
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);
    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
    expensesService = TestBed.inject(ExpensesService) as jasmine.SpyObj<ExpensesService>;


    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(false);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
