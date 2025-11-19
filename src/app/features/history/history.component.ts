import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { HistoryService } from './history.service';
import { History } from '../../models/history.model';
import { CommentStateTypes } from '../../models/states.enum';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzAlertModule,
    DataTableComponent
  ],
  template: `
    <div class="history-container">
      <h2>History</h2>
      <nz-spin [nzSpinning]="loading">
        <app-data-table
          [data]="displayHistory"
          [columns]="columns"
          [loading]="false"
          (searchChange)="onSearch($event)"
        ></app-data-table>
      </nz-spin>
      <nz-alert *ngIf="errorMessage" nzType="error" [nzMessage]="errorMessage" nzShowIcon nzClosable (nzOnClose)="errorMessage = ''"></nz-alert>
    </div>
  `,
  styles: [`
    .history-container {
      padding: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit {
  private historyService = inject(HistoryService);
  private errorHandler = inject(ErrorHandlerService);

  history: History[] = [];
  displayHistory: any[] = [];
  loading = false;
  errorMessage = '';

  columns: TableColumn[] = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'comment_id', title: 'Comment ID', sortable: true },
    { key: 'version', title: 'Version', sortable: true },
    { key: 'change_reason', title: 'Change Reason' },
    { key: 'timestamp', title: 'Timestamp', sortable: true }
  ];

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.historyService.getHistory().subscribe({
      next: (history) => {
        this.history = history;
        this.displayHistory = history.map(h => ({
          ...h,
          timestamp: h.timestamp ? new Date(h.timestamp).toLocaleString() : ''
        }));
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  onSearch(searchValue: string) {
    // Implement search if needed
  }
}