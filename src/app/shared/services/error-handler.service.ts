import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private notificationService: NotificationService) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.error && typeof error.error === 'object') {
        if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.error) {
          errorMessage = error.error.error;
        }
      } else if (error.statusText) {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }

    // Show error notification
    this.notificationService.errorNotification('Error', errorMessage);

    // Log the error
    console.error('Error occurred:', error);

    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }

  handleValidationErrors(errors: any): void {
    if (errors && typeof errors === 'object') {
      const errorMessages: string[] = [];

      for (const field in errors) {
        if (errors.hasOwnProperty(field)) {
          const fieldErrors = errors[field];
          if (Array.isArray(fieldErrors)) {
            errorMessages.push(...fieldErrors);
          } else if (typeof fieldErrors === 'string') {
            errorMessages.push(fieldErrors);
          }
        }
      }

      if (errorMessages.length > 0) {
        this.notificationService.errorNotification('Validation Error', errorMessages.join('; '));
      }
    }
  }

  handleCustomError(message: string, title: string = 'Error'): void {
    this.notificationService.errorNotification(title, message);
  }

  handleSuccess(message: string, title: string = 'Success'): void {
    this.notificationService.successNotification(title, message);
  }
}