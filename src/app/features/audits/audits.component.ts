import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { AuditService } from './audit.service';
import { Audit } from '../../models/audit.model';
import { AuditActionTypes } from '../../models/audit-actions.enum';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

@Component({
  selector: 'app-audits',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzAlertModule,
    DataTableComponent
  ],
  template: `
    <div class="audits-container">
      <h2>Audits</h2>
      <nz-spin [nzSpinning]="loading">
        <app-data-table
          [data]="displayAudits"
          [columns]="columns"
          [loading]="false"
          (searchChange)="onSearch($event)"
        ></app-data-table>
      </nz-spin>
      <nz-alert *ngIf="errorMessage" nzType="error" [nzMessage]="errorMessage" nzShowIcon nzClosable (nzOnClose)="errorMessage = ''"></nz-alert>
    </div>
  `,
  styles: [`
    .audits-container {
      padding: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditsComponent implements OnInit {
  private auditService = inject(AuditService);
  private errorHandler = inject(ErrorHandlerService);

  audits: Audit[] = [];
  displayAudits: any[] = [];
  loading = false;
  errorMessage = '';

  columns: TableColumn[] = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'act', title: 'Action', sortable: true },
    { key: 'date', title: 'Date', sortable: true },
    { key: 'details', title: 'Details' }
  ];

  ngOnInit() {
    this.loadAudits();
  }

  loadAudits() {
    this.loading = true;
    this.auditService.getAudits().subscribe({
      next: (audits) => {
        this.audits = audits;
        this.displayAudits = audits.map(a => ({
          ...a,
          date: a.date ? new Date(a.date).toLocaleString() : ''
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