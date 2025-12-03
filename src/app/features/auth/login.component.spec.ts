import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { StateService } from '../../shared/services/state.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { User } from '../../models/user.model';
import { UserStateTypes } from '../../models/states.enum';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let stateServiceSpy: jasmine.SpyObj<StateService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    const stateSpy = jasmine.createSpyObj('StateService', ['setLoading'], {
      isLoading$: of(false)
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['successMessage']);
    const errorHandlerSpyObj = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: StateService, useValue: stateSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    stateServiceSpy = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    errorHandlerSpy = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize login form with required validators', () => {
      expect(component.loginForm.contains('username')).toBeTruthy();
      expect(component.loginForm.contains('password')).toBeTruthy();
      expect(component.loginForm.get('username')?.validator).toBeTruthy();
      expect(component.loginForm.get('password')?.validator).toBeTruthy();
    });

    it('should initialize register form with required validators', () => {
      expect(component.registerForm.contains('username')).toBeTruthy();
      expect(component.registerForm.contains('password')).toBeTruthy();
      expect(component.registerForm.contains('name')).toBeTruthy();
      expect(component.registerForm.get('username')?.validator).toBeTruthy();
      expect(component.registerForm.get('password')?.validator).toBeTruthy();
      expect(component.registerForm.get('name')?.validator).toBeFalsy(); // Optional
    });
  });

  describe('Login functionality', () => {
    it('should call authService.login on valid form submission', () => {
      const credentials = { username: 'test', password: 'pass' };
      const mockResponse = { data: { access_token: 'token', refresh_token: 'refresh', user: { id: 1, username: 'test', name: 'Test', state: 'ACTIVE' } }, success: true };
      authServiceSpy.login.and.returnValue(of(mockResponse));
      component.loginForm.setValue(credentials);

      component.onLogin();

      expect(stateServiceSpy.setLoading).toHaveBeenCalledWith(true);
      expect(authServiceSpy.login).toHaveBeenCalledWith(credentials);
    });

    it('should navigate to comments and show success message on login success', () => {
      const mockResponse = { data: { access_token: 'token', refresh_token: 'refresh', user: { id: 1, username: 'test', name: 'Test', state: 'ACTIVE' } }, success: true };
      authServiceSpy.login.and.returnValue(of(mockResponse));
      component.loginForm.setValue({ username: 'test', password: 'pass' });

      component.onLogin();

      expect(stateServiceSpy.setLoading).toHaveBeenCalledWith(false);
      expect(notificationServiceSpy.successMessage).toHaveBeenCalledWith('Login successful');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/comments']);
    });

    it('should handle login error', () => {
      const error = new HttpErrorResponse({ error: 'Login failed', status: 401 });
      authServiceSpy.login.and.returnValue(throwError(error));
      component.loginForm.setValue({ username: 'test', password: 'pass' });

      component.onLogin();

      expect(stateServiceSpy.setLoading).toHaveBeenCalledWith(false);
      expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(error);
    });

    it('should not submit if form is invalid', () => {
      component.loginForm.setValue({ username: '', password: '' });

      component.onLogin();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });
  });

  describe('Register functionality', () => {
    it('should call authService.register on valid form submission', () => {
      const user = { username: 'test', password: 'pass', name: 'Test User' };
      const mockUser: User = { id: 1, username: 'test', name: 'Test User', state: UserStateTypes.ACTIVE };
      authServiceSpy.register.and.returnValue(of(mockUser));
      component.registerForm.setValue(user);

      component.onRegister();

      expect(stateServiceSpy.setLoading).toHaveBeenCalledWith(true);
      expect(authServiceSpy.register).toHaveBeenCalledWith(user);
    });

    it('should show success message and reset form on register success', () => {
      const mockUser: User = { id: 1, username: 'test', name: 'Test', state: UserStateTypes.ACTIVE };
      authServiceSpy.register.and.returnValue(of(mockUser));
      component.registerForm.setValue({ username: 'test', password: 'pass', name: 'Test' });

      component.onRegister();

      expect(stateServiceSpy.setLoading).toHaveBeenCalledWith(false);
      expect(notificationServiceSpy.successMessage).toHaveBeenCalledWith('Registration successful. Please login.');
      expect(component.registerForm.get('username')?.value).toBe(null);
    });

    it('should handle register error', () => {
      const error = new HttpErrorResponse({ error: 'Registration failed', status: 400 });
      authServiceSpy.register.and.returnValue(throwError(error));
      component.registerForm.setValue({ username: 'test', password: 'pass', name: '' });

      component.onRegister();

      expect(stateServiceSpy.setLoading).toHaveBeenCalledWith(false);
      expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(error);
    });

    it('should not submit if form is invalid', () => {
      component.registerForm.setValue({ username: '', password: '', name: '' });

      component.onRegister();

      expect(authServiceSpy.register).not.toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('should render login and register tabs', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const tabs = compiled.querySelectorAll('nz-tab');
      expect(tabs.length).toBe(2);
      expect(tabs[0].textContent).toContain('Login');
      expect(tabs[1].textContent).toContain('Register');
    });

    it('should render login form inputs', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const inputs = compiled.querySelectorAll('input[nz-input]');
      expect(inputs.length).toBe(5); // 2 login + 3 register
    });

    it('should show error message when errorMessage is set', () => {
      component.errorMessage = 'Test error';
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const alert = compiled.querySelector('nz-alert');
      expect(alert).toBeTruthy();
      expect(alert.textContent).toContain('Test error');
    });
  });
});