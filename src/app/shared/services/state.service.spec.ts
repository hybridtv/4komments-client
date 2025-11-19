import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { User } from '../../models/user.model';
import { UserStateTypes } from '../../models/states.enum';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateService]
    });
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Authentication state', () => {
    it('should have initial authenticated state as false', (done) => {
      service.isAuthenticated$.subscribe(isAuthenticated => {
        expect(isAuthenticated).toBe(false);
        done();
      });
    });

    it('should set authenticated state', (done) => {
      service.setAuthenticated(true);
      service.isAuthenticated$.subscribe(isAuthenticated => {
        expect(isAuthenticated).toBe(true);
        done();
      });
    });
  });

  describe('Current user state', () => {
    it('should have initial current user as null', (done) => {
      service.currentUser$.subscribe(user => {
        expect(user).toBe(null);
        done();
      });
    });

    it('should set current user', (done) => {
      const testUser: User = { id: 1, username: 'testuser', name: 'Test User', state: UserStateTypes.ACTIVE };
      service.setCurrentUser(testUser);
      service.currentUser$.subscribe(user => {
        expect(user).toEqual(testUser);
        done();
      });
    });

    it('should set current user to null', (done) => {
      service.setCurrentUser(null);
      service.currentUser$.subscribe(user => {
        expect(user).toBe(null);
        done();
      });
    });
  });

  describe('Loading state', () => {
    it('should have initial loading state as false', (done) => {
      service.isLoading$.subscribe(isLoading => {
        expect(isLoading).toBe(false);
        done();
      });
    });

    it('should set loading state', (done) => {
      service.setLoading(true);
      service.isLoading$.subscribe(isLoading => {
        expect(isLoading).toBe(true);
        done();
      });
    });
  });
});