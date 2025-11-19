import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginDto } from '../../models/login.dto';
import { RegisterDto } from '../../models/register.dto';
import { RefreshTokenDto } from '../../models/refresh-token.dto';
import { User } from '../../models/user.model';
import { StateService } from '../../shared/services/state.service';

/**
 * Service responsible for handling authentication-related operations.
 * Manages user login, registration, token refresh, and session state.
 * Uses JWT tokens for authentication and communicates with the backend API.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Base URL for the authentication API endpoints */
  private apiUrl = environment.apiUrl;

  /** HTTP client for making API requests */
  private http = inject(HttpClient);

  /** Router for navigation after authentication actions */
  private router = inject(Router);

  /** State service for managing global application state */
  private stateService = inject(StateService);

  /** BehaviorSubject holding the current authenticated user */
  private userSubject = new BehaviorSubject<User | null>(null);

  /** Observable stream of the current user state */
  public user$ = this.userSubject.asObservable();

  /**
   * Constructor - initializes the service and checks for existing valid tokens.
   * If a valid token exists, sets the authenticated state.
   */
  constructor() {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.stateService.setAuthenticated(true);
      // Optionally load user from token or API
    }
  }

  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - The login credentials (username and password)
   * @returns Observable of the login response containing tokens and user data
   */
  login(credentials: LoginDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        this.setSession(response);
        this.userSubject.next(response.user);
        this.stateService.setAuthenticated(true);
        this.stateService.setCurrentUser(response.user);
      }),
      catchError(error => throwError(error))
    );
  }

  /**
   * Registers a new user account.
   * @param user - The registration data (username, password, optional name)
   * @returns Observable of the registration response
   */
  register(user: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user).pipe(
      catchError(error => throwError(error))
    );
  }

  /**
   * Logs out the current user by clearing tokens and resetting state.
   * Navigates to the login page.
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.userSubject.next(null);
    this.stateService.setAuthenticated(false);
    this.stateService.setCurrentUser(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Refreshes the access token using the refresh token.
   * If refresh fails, automatically logs out the user.
   * @returns Observable of the token refresh response
   */
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return throwError('No refresh token available');
    }
    return this.http.post(`${this.apiUrl}/auth/refresh-token`, { refreshToken } as RefreshTokenDto).pipe(
      tap((response: any) => {
        this.setSession(response);
      }),
      catchError(error => {
        this.logout();
        return throwError(error);
      })
    );
  }

  /**
   * Stores the authentication tokens in localStorage.
   * @param authResult - The authentication response containing access and refresh tokens
   */
  private setSession(authResult: any): void {
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('refresh_token', authResult.refresh_token);
  }

  /**
   * Retrieves the access token from localStorage.
   * @returns The access token string or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Checks if the user is currently logged in by verifying token existence and validity.
   * @returns True if user has a valid token, false otherwise
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Checks if a JWT token has expired by decoding and comparing the expiry time.
   * Considers token expired if expiry is more than 60 seconds in the past.
   * @param token - The JWT token to check
   * @returns True if token is expired or invalid, false if valid
   */
  isTokenExpired(token: string): boolean {
    try {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      return Math.floor(new Date().getTime() / 1000) >= expiry + 60; // Add 60 second buffer
    } catch {
      return true;
    }
  }

  /**
   * Gets the current authenticated user from the BehaviorSubject.
   * @returns The current user object or null if not authenticated
   */
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Ensures the user is authenticated, refreshing tokens if necessary.
   * If authentication fails, logs out the user.
   * @returns Observable that completes when authentication is ensured
   */
  ensureAuthenticated(): Observable<any> {
    if (this.isLoggedIn()) {
      return of(null);
    } else {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken && this.shouldRefreshToken()) {
        return this.refreshToken();
      } else {
        this.logout();
        return throwError('Not authenticated');
      }
    }
  }

  /**
   * Checks if the refresh token should be used (e.g., if access token is expired but refresh token exists and is valid)
   * @returns True if refresh should be attempted
   */
  private shouldRefreshToken(): boolean {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;
    // For now, always try to refresh if refresh token exists and access token is expired
    // Could add logic to check refresh token expiry if needed
    return true;
  }
}