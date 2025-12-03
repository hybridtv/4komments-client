import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { History } from '../../models/history.model';
import ApiResponse from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getHistory(): Observable<History[]> {
    return this.http.get<ApiResponse<History[]>>(`${this.apiUrl}/history`).pipe(
      map(response => response.data),
      catchError(error => throwError(() => error))
    );
  }
}