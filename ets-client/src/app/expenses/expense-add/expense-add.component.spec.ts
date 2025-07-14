import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseAddComponent } from './expense-add.component';
import { AuthService } from '../../security/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { CategoriesService, Category } from '../../categories/categories.service';

describe('ExpenseAddComponent', () => {
  let component: ExpenseAddComponent;
  let fixture: ComponentFixture<ExpenseAddComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getUserId']);

    routerEvents$ = new Subject();
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEvents$.asObservable(),
      routerState: { snapshot: {} }
    });

    const activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']);

    const categorySpy = jasmine.createSpyObj('CategoriesService', [
      'getAllCategoriesByUserId'
    ]);
    categorySpy.getAllCategoriesByUserId.and.returnValue(of([
      { name: 'Food', categoryId: 243545, description: 'Grocery' },
      { name: 'Rent', categoryId: 243545, description: 'utilities' }
    ]));

    await TestBed.configureTestingModule({
      imports: [
        ExpenseAddComponent,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
        { provide: CategoriesService, useValue: categorySpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore routerLink and other unknown elements
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;

    fixture = TestBed.createComponent(ExpenseAddComponent);
    component = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(false);
  });

  it('└── should create the add expense component', () => {
    expect(component).toBeTruthy();
  });

  it('└── should display the add expense form', () => {
    const form = fixture.debugElement.queryAll(By.css('.addExpenseForm'));
    expect(form).toBeTruthy();
  });
  it('└── should allow users to choose an expense category', () => {
    fixture = TestBed.createComponent(ExpenseAddComponent);
    component = fixture.componentInstance;
    component.categories =  [
      {categoryId:  1000, userId: 30003, name: 'Grocery', description: 'spent on food'}
    ];
    fixture.detectChanges();
    const
    selectEl = fixture.debugElement.query(By.css('#categoryId')),
    optionOne = selectEl.queryAll(By.css('.category-option'));
    expect(optionOne[1].nativeElement.textContent).toContain(component.categories[0].name);
  });
  it('└── should not allow amount less that $0.01', () => {
    fixture = TestBed.createComponent(ExpenseAddComponent);
    component = fixture.componentInstance;
    component.addExpenseForm.get('amount')!.setValue('0');
    component.addExpenseForm.markAllAsTouched();
    fixture.detectChanges();
    const
    errorEl = fixture.debugElement.queryAll(By.css('.__form_error')),
    amountErrorEl = errorEl[0];
    expect(amountErrorEl.nativeElement.textContent).toContain('a valid amount is required (min $0.01)!');
  });
});
