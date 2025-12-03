import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';
import { LoginResponseDto } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<LoginResponseDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor() { }

  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  setCurrentUser(user: LoginResponseDto | null) {
    this.currentUserSubject.next(user);
  }

  setLoading(isLoading: boolean) {
    this.isLoadingSubject.next(isLoading);
  }
}