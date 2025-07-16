import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryUpdateComponent } from './category-update.component';
import { CategoriesService, Category } from '../categories.service';
import { AuthService } from '../../security/auth.service';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('CategoryUpdateComponent', () => {
  let
    component: CategoryUpdateComponent,
    fixture: ComponentFixture<CategoryUpdateComponent>,
    authService: jasmine.SpyObj<AuthService>,
    router: jasmine.SpyObj<Router>,
    routerEvents$: Subject<any>,
    categoriesService: jasmine.SpyObj<CategoriesService>
  ;

  const mockCategories: Category[] = [{
    name:        'Utilities',
    slug:        'utilities',
    userId:       10090,
    categoryId:   20009,
    description: 'reoccurring',
    dateCreated:  new Date(),
    dateModified: new Date(),
  },{
    name:        'Grocery',
    slug:        'grocery',
    userId:       10090,
    categoryId:   20009,
    description: 'spent on food',
    dateCreated:  new Date(),
    dateModified: new Date(),
  }];

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
      imports: [CategoryUpdateComponent, ReactiveFormsModule],
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

    fixture = TestBed.createComponent(CategoryUpdateComponent);
    component = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(false);
    fixture.detectChanges();
  });

  afterEach(() => { fixture.destroy(); });

  it('└── should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('└── should allow users to select a category', () => {
    component.updateCategoryForm.get('categoryId')!.setValue('243545');
    component.updateCategoryForm.markAllAsTouched();
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('.update-fields-container'));
    expect(form).toBeTruthy();
  });

  it('└── should allow users to change category name', () => {
    component.updateCategoryForm.get('categoryId')!.setValue('243545');
    component.updateCategoryForm.markAllAsTouched();
    fixture.detectChanges();

    component.updateCategoryForm.get('name')!.setValue('Food');
    component.updateCategoryForm.markAllAsTouched();
    fixture.detectChanges();

    expect(component.updateCategoryForm.controls['name'].value).toContain('Food');
  });

  it('└── should allow users to change category description', () => {
    component.updateCategoryForm.get('categoryId')!.setValue('243545');
    component.updateCategoryForm.markAllAsTouched();
    fixture.detectChanges();

    component.updateCategoryForm.get('description')!.setValue('Spent on food');
    component.updateCategoryForm.markAllAsTouched();
    fixture.detectChanges();

    expect(component.updateCategoryForm.controls['description'].value).toContain('Spent on food');
  });
});
