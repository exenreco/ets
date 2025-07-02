import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';

describe('AuthService', () => {
  let service: AuthService;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CookieService', ['set', 'deleteAll']);
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: CookieService, useValue: spy }]
    });
    service = TestBed.inject(AuthService);
    cookieServiceSpy = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set cookie and authState to true on successful signin', () => { const result = service.signin("test@ets.com", "testuser01", "test");
    expect(result).toBeTrue();
    expect(service.getAuthState().subscribe(state => expect(state).toBeTrue()));
    expect(cookieServiceSpy.set.calls.count()).toBe(1); });
});
