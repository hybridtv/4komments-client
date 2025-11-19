import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Audit } from '../../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getAudits(): Observable<Audit[]> {
    return this.http.get<Audit[]>(`${this.apiUrl}/audits`).pipe(
      catchError(error => throwError(() => error))
    );
  }
}