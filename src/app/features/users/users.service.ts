import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { RegisterDto } from '../../models/register.dto';
import ApiResponse from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`).pipe(
      map(response => response.data),
      catchError(error => throwError(() => error))
    );
  }

  createUser(user: RegisterDto): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/users`, user).pipe(
      map(response => response.data),
      catchError(error => throwError(() => error))
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/users/${id}`, user).pipe(
      map(response => response.data),
      catchError(error => throwError(() => error))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/users/${id}`).pipe(
      map(response => response.data),
      catchError(error => throwError(() => error))
    );
  }
}