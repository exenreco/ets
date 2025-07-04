import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let cookieService: CookieService;
  let router: Router;
  let jwtHelper: JwtHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        CookieService,
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    jwtHelper = new JwtHelperService();

    // Clear cookies before each test
    cookieService.deleteAll();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('login()', () => {
    const credentials = { username: 'testUser', password: 'password' };
    const mockResponse = {
      token: 'fake-jwt-token',
      userId: '123',
      username: 'testUser'
    };

    it('should make POST request to signin endpoint', () => {
      authService.login(credentials.username, credentials.password).subscribe();
      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/security/signin`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should set cookies and navigate on success', () => {
      authService.login(credentials.username, credentials.password).subscribe(() => {
        expect(cookieService.get('sessionUser')).toBe(mockResponse.token);
        expect(cookieService.get('sessionUserId')).toBe(mockResponse.userId);
        expect(cookieService.get('sessionUserName')).toBe(mockResponse.username);
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/security/signin`);
      req.flush(mockResponse);
    });

    it('should not set cookies on invalid response', () => {
      authService.login(credentials.username, credentials.password).subscribe(() => {
        expect(cookieService.get('sessionUser')).toBe('');
        expect(cookieService.get('sessionUserId')).toBe('');
        expect(cookieService.get('sessionUserName')).toBe('');
        expect(router.navigate).not.toHaveBeenCalled();
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/security/signin`);
      req.flush({}); // Invalid response (no token)
    });
  });

  describe('isAuthenticated()', () => {
    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBeFalse();
    });

    it('should return true for valid token', () => {
      // Create non-expired token
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
        + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 1000 }))
        + '.signature';

      cookieService.set('sessionUser', validToken);
      expect(authService.isAuthenticated()).toBeTrue();
    });

    it('should return false for expired token', () => {
      // Create expired token
      const expiredToken =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
        + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 1000 }))
        + '.signature';

      cookieService.set('sessionUser', expiredToken);
      expect(authService.isAuthenticated()).toBeFalse();
    });
  });

  describe('getUserId()', () => {
    it('should return user ID from cookies', () => {
      cookieService.set('sessionUserId', 'test-123');
      expect(authService.getUserId()).toBe('test-123');
    });
  });

  describe('logout()', () => {
    it('should clear cookies and navigate to signin', () => {
      // Set cookies
      cookieService.set('sessionUser', 'token');
      cookieService.set('sessionUserId', '123');
      cookieService.set('sessionUserName', 'user');

      authService.logout();

      // Verify cookies cleared
      expect(cookieService.get('sessionUser')).toBe('');
      expect(cookieService.get('sessionUserId')).toBe('');
      expect(cookieService.get('sessionUserName')).toBe('');

      // Verify navigation
      expect(router.navigate).toHaveBeenCalledWith(['signin']);
    });
  });

  describe('handleAuthError()', () => {
    it('should call logout on 401 error', () => {
      spyOn(authService, 'logout');
      authService.handleAuthError({ status: 401 });
      expect(authService.logout).toHaveBeenCalled();
    });

    it('should not call logout on non-401 errors', () => {
      spyOn(authService, 'logout');
      authService.handleAuthError({ status: 500 });
      expect(authService.logout).not.toHaveBeenCalled();
    });
  });
});
