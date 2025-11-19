import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { ModalFormComponent, FormField } from '../../shared/components/modal-form/modal-form.component';
import { CommentService } from './comment.service';
import { Comment } from '../../models/comment.model';
import { CreateCommentDto } from '../../models/create-comment.dto';
import { ChangeCommentDto } from '../../models/change-state.dto';
import { CommentStateTypes } from '../../models/states.enum';
import { ItemType } from '../../models/items.enum';
import { NotificationService } from '../../shared/services/notification.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { StateService } from '../../shared/services/state.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzAlertModule,
    NzButtonModule,
    DataTableComponent,
    ModalFormComponent,
    AsyncPipe
  ],
  template: `
    <div class="comments-container">
      <h2>Comments Management</h2>
      <nz-spin [nzSpinning]="(isLoading$ | async)">
        <app-data-table
          [data]="displayComments"
          [columns]="columns"
          [loading]="false"
          [actions]="tableActions"
          [rowActions]="rowActions"
          (searchChange)="onSearch($event)"
        ></app-data-table>
      </nz-spin>
      <nz-alert *ngIf="errorMessage" nzType="error" [nzMessage]="errorMessage" nzShowIcon nzClosable (nzOnClose)="errorMessage = ''"></nz-alert>
      <app-modal-form
        [isVisible]="modalVisible"
        [title]="modalTitle"
        [fields]="modalFields"
        [initialData]="modalData"
        (submit)="onModalSubmit($event)"
        (cancel)="onModalCancel()"
      ></app-modal-form>
    </div>
  `,
  styles: [`
    .comments-container {
      padding: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsComponent implements OnInit {
  private commentService = inject(CommentService);
  private notificationService = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private stateService = inject(StateService);

  comments: Comment[] = [];
  displayComments: any[] = [];
  isLoading$ = this.stateService.isLoading$;
  errorMessage = '';
  modalVisible = false;
  modalTitle = '';
  modalData: any = {};
  selectedComment: Comment | null = null;

  columns: TableColumn[] = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'text', title: 'Text' },
    { key: 'state', title: 'State', sortable: true },
    { key: 'created', title: 'Created', sortable: true }
  ];

  tableActions: TableAction[] = [
    {
      label: 'New Comment',
      icon: 'plus',
      type: 'primary',
      action: () => this.openNewCommentModal()
    }
  ];

  rowActions: TableAction[] = [
    {
      label: 'Approve',
      icon: 'check',
      action: (item: any) => this.changeState(item.id, CommentStateTypes.PUBLISHED)
    },
    {
      label: 'Reject',
      icon: 'close',
      action: (item: any) => this.changeState(item.id, CommentStateTypes.UNPUBLISHED)
    },
    {
      label: 'Delete',
      icon: 'delete',
      action: (item: any) => this.changeState(item.id, CommentStateTypes.DELETED)
    }
  ];

  modalFields: FormField[] = [
    {
      key: 'text',
      label: 'Comment Text',
      type: 'textarea',
      required: true
    },
    {
      key: 'user_name',
      label: 'User Name',
      type: 'input',
      required: true
    },
    {
      key: 'item_id',
      label: 'Item ID',
      type: 'input',
      required: true
    },
    {
      key: 'item_type',
      label: 'Item Type',
      type: 'select',
      required: true,
      options: [
        { label: 'News', value: ItemType.News },
        { label: 'Media', value: ItemType.Media }
      ]
    }
  ];

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.stateService.setLoading(true);
    this.commentService.getComments().subscribe({
      next: (comments) => {
        this.comments = comments;
        this.displayComments = comments.map(c => ({
          ...c,
          state: this.getStateLabel(c.state),
          created: c.created ? new Date(c.created).toLocaleString() : ''
        }));
        this.stateService.setLoading(false);
      },
      error: (error) => {
        this.stateService.setLoading(false);
        this.errorHandler.handleError(error);
      }
    });
  }

  getStateLabel(state?: CommentStateTypes): string {
    switch (state) {
      case CommentStateTypes.PUBLISHED: return 'Published';
      case CommentStateTypes.UNPUBLISHED: return 'Unpublished';
      case CommentStateTypes.DELETED: return 'Deleted';
      case CommentStateTypes.ARCHIVED: return 'Archived';
      default: return 'Unknown';
    }
  }

  changeState(id: number, newState: CommentStateTypes) {
    const dto: ChangeCommentDto = { state: newState };
    this.commentService.updateCommentState(id, dto).subscribe({
      next: () => {
        this.notificationService.successMessage('Comment state updated');
        this.loadComments();
      },
      error: (error) => this.errorHandler.handleError(error)
    });
  }

  openNewCommentModal() {
    this.modalTitle = 'New Comment';
    this.modalData = {};
    this.modalVisible = true;
  }

  onModalSubmit(data: any) {
    const dto: CreateCommentDto = {
      text: data.text,
      user_name: data.user_name,
      item_id: +data.item_id,
      item_type: data.item_type
    };
    this.commentService.createComment(dto).subscribe({
      next: () => {
        this.notificationService.successMessage('Comment created');
        this.modalVisible = false;
        this.loadComments();
      },
      error: (error) => this.errorHandler.handleError(error)
    });
  }

  onModalCancel() {
    this.modalVisible = false;
  }

  onSearch(searchValue: string) {
    // Implement search if needed
  }
}