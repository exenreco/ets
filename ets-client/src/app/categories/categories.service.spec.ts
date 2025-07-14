import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { CategoriesService, Category } from './categories.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController,  provideHttpClientTesting } from '@angular/common/http/testing';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService, httpMock: HttpTestingController;

  beforeEach(async () => {

    TestBed.configureTestingModule({

      imports: [],

      providers: [
        CategoriesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]

    });

    httpMock = TestBed.inject(HttpTestingController);

    categoriesService = TestBed.inject(CategoriesService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('└── should create the Categories Service', () => {
    expect(categoriesService).toBeTruthy();
  });

  it('└── should get a category name by category id', () => {
    const
      mockReq: number =  10000023,
      mockRes: string = 'food'
    ;

    spyOn(categoriesService, 'getCategoryNameById').and.returnValue(of('food'));

    categoriesService.getCategoryNameById(mockReq).subscribe(res => res);

    expect(categoriesService.getCategoryNameById).toHaveBeenCalledWith(mockReq);// Assert that the spy was called

    expect(mockRes).toEqual('food'); // And assert that the result matches
  });

  it('└── should get all expense categories by user id', () => {
    const
    mockRes:  Category[] = [{
      name:           'Grocery',
      userId:         100001,
      categoryId:     5000055,
      description:    'expenses spent on grocery'
    },
    {
      name:           'Utilities',
      userId:         100001,
      categoryId:     5000035,
      description:    'monthly payments'
    }];

    spyOn(categoriesService, 'getAllCategoriesByUserId').and.returnValue(of(mockRes));

    let result: Category[] | undefined;

    categoriesService.getAllCategoriesByUserId().subscribe(res => result = res);

    expect(categoriesService.getAllCategoriesByUserId).toHaveBeenCalledWith();

    expect(result).toEqual(mockRes);
  });

  it('└── should return an empty array when user has no expense category', () => {
    const
    mockRes:  Category[] = [];

    spyOn(categoriesService, 'getAllCategoriesByUserId').and.returnValue(of(mockRes));

    let result: Category[] | undefined;

    categoriesService.getAllCategoriesByUserId().subscribe(res => result = res);

    expect(categoriesService.getAllCategoriesByUserId).toHaveBeenCalledWith();

    expect(result).toEqual(mockRes);
  });
});
