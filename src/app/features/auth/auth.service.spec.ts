import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { StateService } from '../../shared/services/state.service';
import { LoginDto } from '../../models/login.dto';
import { RegisterDto } from '../../models/register.dto';
import { User } from '../../models/user.model';
import { UserStateTypes } from '../../models/states.enum';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let stateServiceSpy: jasmine.SpyObj<StateService>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const stateServiceSpyObj = jasmine.createSpyObj('StateService', ['setAuthenticated', 'setCurrentUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj },
        { provide: StateService, useValue: stateServiceSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    stateServiceSpy = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and set session', () => {
      const credentials: LoginDto = { username: 'test', password: 'pass' };
      const mockResponse = {
        data: {
          access_token: 'token',
          refresh_token: 'refresh',
          user: { id: 1, username: 'test', name: 'Test User', state: UserStateTypes.ACTIVE }
        },
        success: true
      };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);

      expect(stateServiceSpy.setAuthenticated).toHaveBeenCalledWith(true);
      expect(stateServiceSpy.setCurrentUser).toHaveBeenCalledWith(mockResponse.data.user);
    });

    it('should handle login error', () => {
      const credentials: LoginDto = { username: 'test', password: 'pass' };
      const errorMessage = 'Invalid credentials';

      service.login(credentials).subscribe(
        () => fail('should have failed'),
        error => expect(error.error).toBe(errorMessage)
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register successfully', () => {
      const user: RegisterDto = { username: 'test', password: 'pass' };
      const mockUser: User = { id: 1, username: 'test', name: 'Test User', state: UserStateTypes.ACTIVE };
      const mockResponse = { data: mockUser, success: true };

      service.register(user).subscribe(response => {
        expect(response).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle register error', () => {
      const user: RegisterDto = { username: 'test', password: 'pass' };
      const errorMessage = 'Registration failed';

      service.register(user).subscribe(
        () => fail('should have failed'),
        error => expect(error.error).toBe(errorMessage)
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('logout', () => {
    it('should clear session and navigate to login', () => {
      spyOn(localStorage, 'removeItem');
      spyOn(localStorage, 'getItem').and.returnValue('token');

      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(stateServiceSpy.setAuthenticated).toHaveBeenCalledWith(false);
      expect(stateServiceSpy.setCurrentUser).toHaveBeenCalledWith(null);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      const refreshToken = 'refresh_token';
      spyOn(localStorage, 'getItem').and.returnValue(refreshToken);
      const tokens = { access_token: 'new_token', refresh_token: 'new_refresh' };
      const mockResponse = { data: tokens, success: true };

      service.refreshToken().subscribe(response => {
        expect(response).toEqual(tokens);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh-token`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle refresh token error and logout', () => {
      spyOn(localStorage, 'getItem').and.returnValue('refresh_token');
      spyOn(service, 'logout');

      service.refreshToken().subscribe(
        () => fail('should have failed'),
        error => expect(error).toBeDefined()
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh-token`);
      req.flush('error', { status: 401, statusText: 'Unauthorized' });

      expect(service.logout).toHaveBeenCalled();
    });

    it('should throw error if no refresh token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      service.refreshToken().subscribe(
        () => fail('should have failed'),
        error => expect(error).toBe('No refresh token available')
      );
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('token');
      expect(service.getToken()).toBe('token');
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if token exists and not expired', () => {
      spyOn(localStorage, 'getItem').and.returnValue('valid.token.here');
      spyOn(service, 'isTokenExpired').and.returnValue(false);
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false if no token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      expect(service.isLoggedIn()).toBe(false);
    });

    it('should return false if token expired', () => {
      spyOn(localStorage, 'getItem').and.returnValue('token');
      spyOn(service, 'isTokenExpired').and.returnValue(true);
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyMzkwMjJ9.example';
      expect(service.isTokenExpired(expiredToken)).toBe(true);
    });

    it('should return false for valid token', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const validToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOj${futureTime}fQ.example`;
      expect(service.isTokenExpired(validToken)).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      const user: User = { id: 1, username: 'test', name: 'Test User', state: UserStateTypes.ACTIVE };
      service['userSubject'].next(user);
      expect(service.getCurrentUser()).toEqual(user);
    });
  });

  describe('ensureAuthenticated', () => {
    it('should return observable if logged in', () => {
      spyOn(service, 'isLoggedIn').and.returnValue(true);
      service.ensureAuthenticated().subscribe(result => {
        expect(result).toBe(null);
      });
    });

    it('should refresh token if not logged in but has refresh token', () => {
      spyOn(service, 'isLoggedIn').and.returnValue(false);
      spyOn(localStorage, 'getItem').and.returnValue('refresh_token');
      spyOn(service, 'refreshToken').and.returnValue(of({}));

      service.ensureAuthenticated().subscribe();

      expect(service.refreshToken).toHaveBeenCalled();
    });

    it('should logout and throw error if not logged in and no refresh token', () => {
      spyOn(service, 'isLoggedIn').and.returnValue(false);
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(service, 'logout');

      service.ensureAuthenticated().subscribe(
        () => fail('should have failed'),
        error => expect(error).toBe('Not authenticated')
      );

      expect(service.logout).toHaveBeenCalled();
    });
  });
});