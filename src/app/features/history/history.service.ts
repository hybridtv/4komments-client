import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { History } from '../../models/history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getHistory(): Observable<History[]> {
    return this.http.get<History[]>(`${this.apiUrl}/history`).pipe(
      catchError(error => throwError(() => error))
    );
  }
}