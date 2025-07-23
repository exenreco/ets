import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorGlobalComponent } from './error-global.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ErrorGlobalComponent', () => {
  let
    component: ErrorGlobalComponent,
    fixture: ComponentFixture<ErrorGlobalComponent>,
    httpMock: HttpTestingController,
    router: jasmine.SpyObj<Router>,
    routerEvents$: Subject<any>
  ;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    const
    activatedSpy = jasmine.createSpyObj('ActivatedRoute', ['firstChild']),
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
      events: routerEvents$.asObservable(),
      routerState: { snapshot: {} }
    });
    routerSpy.createUrlTree.and.returnValue({} as any);
    routerSpy.serializeUrl.and.returnValue('');

    await TestBed.configureTestingModule({
      imports: [ErrorGlobalComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedSpy }
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(ErrorGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
