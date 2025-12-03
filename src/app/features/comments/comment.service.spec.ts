import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { Comment } from '../../models/comment.model';
import { CreateCommentDto } from '../../models/create-comment.dto';
import { ChangeCommentDto } from '../../models/change-state.dto';
import { CommentStateTypes } from '../../models/states.enum';
import { ItemType } from '../../models/items.enum';
import { environment } from '../../../environments/environment';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getComments', () => {
    it('should return comments', () => {
      const mockComments: Comment[] = [
        { id: 1, item_id: 1, item_type: ItemType.News, user_name: 'Test User', text: 'Test comment', state: CommentStateTypes.PUBLISHED }
      ];

      service.getComments().subscribe(comments => {
        expect(comments).toEqual(mockComments);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comments`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockComments, success: true });
    });

    it('should handle error', () => {
      service.getComments().subscribe(
        () => fail('should have failed'),
        error => expect(error).toBeDefined()
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/comments`);
      req.flush('error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('createComment', () => {
    it('should create comment', () => {
      const commentDto: CreateCommentDto = { item_id: 1, item_type: ItemType.News, user_name: 'Test User', text: 'New comment' };
      const mockComment: Comment = {
        id: 1,
        item_id: 1,
        item_type: ItemType.News,
        user_name: 'Test User',
        text: 'New comment',
        state: CommentStateTypes.PUBLISHED
      };

      service.createComment(commentDto).subscribe(comment => {
        expect(comment).toEqual(mockComment);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(commentDto);
      req.flush({ data: mockComment, success: true });
    });

    it('should handle error', () => {
      const commentDto: CreateCommentDto = { item_id: 1, item_type: ItemType.News, user_name: 'Test User', text: 'New comment' };

      service.createComment(commentDto).subscribe(
        () => fail('should have failed'),
        error => expect(error).toBeDefined()
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/comments`);
      req.flush('error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateCommentState', () => {
    it('should update comment state', () => {
      const id = 1;
      const stateDto: ChangeCommentDto = { state: CommentStateTypes.ARCHIVED };
      const mockComment: Comment = {
        id: 1,
        item_id: 1,
        item_type: ItemType.News,
        user_name: 'Test User',
        text: 'Test comment',
        state: CommentStateTypes.ARCHIVED
      };

      service.updateCommentState(id, stateDto).subscribe(comment => {
        expect(comment).toEqual(mockComment);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comments/${id}/state`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(stateDto);
      req.flush({ data: mockComment, success: true });
    });

    it('should handle error', () => {
      const id = 1;
      const stateDto: ChangeCommentDto = { state: CommentStateTypes.ARCHIVED };

      service.updateCommentState(id, stateDto).subscribe(
        () => fail('should have failed'),
        error => expect(error).toBeDefined()
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/comments/${id}/state`);
      req.flush('error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteComment', () => {
    it('should delete comment', () => {
      const id = 1;

      service.deleteComment(id).subscribe(result => {
        expect(result).toBeUndefined();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comments/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ data: undefined, success: true });
    });

    it('should handle error', () => {
      const id = 1;

      service.deleteComment(id).subscribe(
        () => fail('should have failed'),
        error => expect(error).toBeDefined()
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/comments/${id}`);
      req.flush('error', { status: 404, statusText: 'Not Found' });
    });
  });
});