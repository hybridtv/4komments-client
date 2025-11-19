import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Comment } from '../../models/comment.model';
import { CreateCommentDto } from '../../models/create-comment.dto';
import { ChangeCommentDto } from '../../models/change-state.dto';

/**
 * Service for managing comment-related operations.
 * Handles CRUD operations for comments including fetching, creating, updating state, and deleting.
 * Communicates with the backend API for all comment operations.
 */
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  /** Base URL for the comments API endpoints */
  private apiUrl = environment.apiUrl;

  /** HTTP client for making API requests */
  private http = inject(HttpClient);

  /**
   * Retrieves all comments from the server.
   * @returns Observable stream of comment array
   */
  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  /**
   * Creates a new comment on the server.
   * @param comment - The comment data to create
   * @returns Observable of the created comment
   */
  createComment(comment: CreateCommentDto): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, comment).pipe(
      catchError(error => throwError(() => error))
    );
  }

  /**
   * Updates the state of an existing comment.
   * @param id - The ID of the comment to update
   * @param state - The new state data
   * @returns Observable of the updated comment
   */
  updateCommentState(id: number, state: ChangeCommentDto): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/comments/${id}/state`, state).pipe(
      catchError(error => throwError(() => error))
    );
  }

  /**
   * Deletes a comment by its ID.
   * @param id - The ID of the comment to delete
   * @returns Observable that completes when deletion is successful
   */
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${id}`).pipe(
      catchError(error => throwError(() => error))
    );
  }
}