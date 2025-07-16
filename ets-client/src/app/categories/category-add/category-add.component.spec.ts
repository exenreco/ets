import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAddComponent } from './category-add.component';
import { AuthService } from '../../security/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CategoryUpdateComponent } from '../category-update/category-update.component';
import { By } from '@angular/platform-browser';

describe('CategoryAddComponent', () => {
  let
    component: CategoryAddComponent,
    fixture: ComponentFixture<CategoryAddComponent>,
    authService: jasmine.SpyObj<AuthService>,
    router: jasmine.SpyObj<Router>,
    routerEvents$: Subject<any>,
    categoriesService: jasmine.SpyObj<CategoriesService>
  ;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    const

      authSpy = jasmine.createSpyObj('AuthService', [
        'isAuthenticated',
        'getUserId'
      ]),

      routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
        events: routerEvents$.asObservable(),
        routerState: { snapshot: {} }
      }),

      activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']),

      categorySpy = jasmine.createSpyObj('CategoriesService', [
        'updateCategory',
        'getCategoryNameById',
        'getAllCategoriesByUserId'
      ])
    ;

    categorySpy.getAllCategoriesByUserId.and.returnValue(of([
      { name: 'Food', categoryId: 243545, description: 'Grocery' },
      { name: 'Rent', categoryId: 243545, description: 'utilities' }
    ]));

    await TestBed.configureTestingModule({
      imports: [CategoryAddComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideHttpClientTesting(),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: AuthService, useValue: authSpy },
        { provide: CategoriesService, useValue: categorySpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;

    fixture = TestBed.createComponent(CategoryAddComponent);
    component = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(false);
    fixture.detectChanges();
  });

  afterEach(() => { fixture.destroy(); });

  it('└── should create', () => {
    expect(component).toBeTruthy();
  });

  it('└── should display the add Expense Category Form', () => {
    const form = fixture.nativeElement.querySelector('.addExpenseCategoryForm');
    expect(form).toBeTruthy();
  });

  it('└── should allow users to enter a category name', () => {
    component.addExpenseCategoryForm.get('name')!.setValue('');
    component.addExpenseCategoryForm.markAllAsTouched();
    fixture.detectChanges();
    const
    errorEl = fixture.debugElement.queryAll(By.css('.__form_error')),
    amountErrorEl = errorEl[0];
    expect(amountErrorEl.nativeElement.textContent).toContain('a valid category name is required');
  });

  it('└── should allow users to enter a category description', () => {
    component.addExpenseCategoryForm.get('description')!.setValue('');
    component.addExpenseCategoryForm.markAllAsTouched();
    fixture.detectChanges();
    const
    errorEl = fixture.debugElement.queryAll(By.css('.__form_error')),
    amountErrorEl = errorEl[1];
    expect(amountErrorEl.nativeElement.textContent).toContain('a description is required ');
  });

});
