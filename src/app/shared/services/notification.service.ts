import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  // Message methods
  successMessage(content: string, duration?: number): void {
    this.message.success(content, { nzDuration: duration || 3000 });
  }

  errorMessage(content: string, duration?: number): void {
    this.message.error(content, { nzDuration: duration || 3000 });
  }

  infoMessage(content: string, duration?: number): void {
    this.message.info(content, { nzDuration: duration || 3000 });
  }

  warningMessage(content: string, duration?: number): void {
    this.message.warning(content, { nzDuration: duration || 3000 });
  }

  loadingMessage(content: string, duration?: number): void {
    this.message.loading(content, { nzDuration: duration || 0 });
  }

  // Notification methods
  successNotification(title: string, content?: string, duration?: number): void {
    this.notification.success(title, content || '', { nzDuration: duration || 4500 });
  }

  errorNotification(title: string, content?: string, duration?: number): void {
    this.notification.error(title, content || '', { nzDuration: duration || 4500 });
  }

  infoNotification(title: string, content?: string, duration?: number): void {
    this.notification.info(title, content || '', { nzDuration: duration || 4500 });
  }

  warningNotification(title: string, content?: string, duration?: number): void {
    this.notification.warning(title, content || '', { nzDuration: duration || 4500 });
  }

  // Generic notification
  showNotification(type: 'success' | 'error' | 'info' | 'warning', title: string, content?: string, duration?: number): void {
    this.notification.create(type, title, content || '', { nzDuration: duration || 4500 });
  }

  // Remove all messages
  removeAllMessages(): void {
    this.message.remove();
  }

  // Remove all notifications
  removeAllNotifications(): void {
    this.notification.remove();
  }
}