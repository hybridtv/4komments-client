import { TestBed } from '@angular/core/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let messageServiceSpy: jasmine.SpyObj<NzMessageService>;
  let notificationServiceSpy: jasmine.SpyObj<NzNotificationService>;

  beforeEach(() => {
    const messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'info', 'warning', 'loading', 'remove']);
    const notificationSpy = jasmine.createSpyObj('NzNotificationService', ['success', 'error', 'info', 'warning', 'create', 'remove']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: NzMessageService, useValue: messageSpy },
        { provide: NzNotificationService, useValue: notificationSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    messageServiceSpy = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
    notificationServiceSpy = TestBed.inject(NzNotificationService) as jasmine.SpyObj<NzNotificationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Message methods', () => {
    it('should show success message', () => {
      service.successMessage('Success');
      expect(messageServiceSpy.success).toHaveBeenCalledWith('Success', { nzDuration: 3000 });
    });

    it('should show success message with custom duration', () => {
      service.successMessage('Success', 5000);
      expect(messageServiceSpy.success).toHaveBeenCalledWith('Success', { nzDuration: 5000 });
    });

    it('should show error message', () => {
      service.errorMessage('Error');
      expect(messageServiceSpy.error).toHaveBeenCalledWith('Error', { nzDuration: 3000 });
    });

    it('should show info message', () => {
      service.infoMessage('Info');
      expect(messageServiceSpy.info).toHaveBeenCalledWith('Info', { nzDuration: 3000 });
    });

    it('should show warning message', () => {
      service.warningMessage('Warning');
      expect(messageServiceSpy.warning).toHaveBeenCalledWith('Warning', { nzDuration: 3000 });
    });

    it('should show loading message', () => {
      service.loadingMessage('Loading');
      expect(messageServiceSpy.loading).toHaveBeenCalledWith('Loading', { nzDuration: 0 });
    });
  });

  describe('Notification methods', () => {
    it('should show success notification', () => {
      service.successNotification('Title', 'Content');
      expect(notificationServiceSpy.success).toHaveBeenCalledWith('Title', 'Content', { nzDuration: 4500 });
    });

    it('should show success notification without content', () => {
      service.successNotification('Title');
      expect(notificationServiceSpy.success).toHaveBeenCalledWith('Title', '', { nzDuration: 4500 });
    });

    it('should show error notification', () => {
      service.errorNotification('Title', 'Content');
      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Title', 'Content', { nzDuration: 4500 });
    });

    it('should show info notification', () => {
      service.infoNotification('Title', 'Content');
      expect(notificationServiceSpy.info).toHaveBeenCalledWith('Title', 'Content', { nzDuration: 4500 });
    });

    it('should show warning notification', () => {
      service.warningNotification('Title', 'Content');
      expect(notificationServiceSpy.warning).toHaveBeenCalledWith('Title', 'Content', { nzDuration: 4500 });
    });
  });

  describe('Generic notification', () => {
    it('should show generic success notification', () => {
      service.showNotification('success', 'Title', 'Content');
      expect(notificationServiceSpy.create).toHaveBeenCalledWith('success', 'Title', 'Content', { nzDuration: 4500 });
    });

    it('should show generic notification without content', () => {
      service.showNotification('error', 'Title');
      expect(notificationServiceSpy.create).toHaveBeenCalledWith('error', 'Title', '', { nzDuration: 4500 });
    });

    it('should show generic notification with custom duration', () => {
      service.showNotification('info', 'Title', 'Content', 6000);
      expect(notificationServiceSpy.create).toHaveBeenCalledWith('info', 'Title', 'Content', { nzDuration: 6000 });
    });
  });

  describe('Remove methods', () => {
    it('should remove all messages', () => {
      service.removeAllMessages();
      expect(messageServiceSpy.remove).toHaveBeenCalled();
    });

    it('should remove all notifications', () => {
      service.removeAllNotifications();
      expect(notificationServiceSpy.remove).toHaveBeenCalled();
    });
  });
});