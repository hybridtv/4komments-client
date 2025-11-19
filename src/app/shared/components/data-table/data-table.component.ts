import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  type?: 'primary' | 'default' | 'dashed' | 'link';
  action: (item: any) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzPaginationModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzMenuModule
  ],
  template: `
    <div class="data-table-container">
      <div class="table-header" *ngIf="showSearch || actions.length > 0">
        <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton" *ngIf="showSearch">
          <input type="text" nz-input placeholder="Search..." [(ngModel)]="searchValue" (input)="onSearch()" />
        </nz-input-group>
        <ng-template #suffixIconButton>
          <button nz-button nzType="primary" nzSearch (click)="onSearch()"><span nz-icon nzType="search"></span></button>
        </ng-template>
        <div class="actions" *ngIf="actions.length > 0">
          <button *ngFor="let action of actions" nz-button [nzType]="action.type || 'default'" (click)="action.action(null)">
            <span *ngIf="action.icon" nz-icon [nzType]="action.icon"></span>
            {{ action.label }}
          </button>
        </div>
      </div>
      <nz-table
        #table
        [nzData]="filteredData"
        [nzLoading]="loading"
        [nzFrontPagination]="false"
        [nzTotal]="total"
        [nzPageIndex]="pageIndex"
        [nzPageSize]="pageSize"
        (nzQueryParams)="onQueryParamsChange($event)"
        [nzShowPagination]="showPagination"
        [nzPaginationPosition]="paginationPosition"
        [nzScroll]="scroll"
      >
        <thead>
          <tr>
            <th *ngFor="let column of columns" [nzSortFn]="column.sortable ? sortFn(column.key) : null" [nzWidth]="column.width || null">
              {{ column.title }}
            </th>
            <th *ngIf="rowActions.length > 0" nzWidth="150px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of table.data">
            <td *ngFor="let column of columns">{{ item[column.key] }}</td>
            <td *ngIf="rowActions.length > 0">
              <nz-dropdown-menu #menu="nzDropdownMenu">
                <ul nz-menu>
                  <li nz-menu-item *ngFor="let action of rowActions" (click)="action.action(item)">
                    <span *ngIf="action.icon" nz-icon [nzType]="action.icon"></span>
                    {{ action.label }}
                  </li>
                </ul>
              </nz-dropdown-menu>
              <button nz-button nz-dropdown [nzDropdownMenu]="menu" nzPlacement="bottomRight">
                <span nz-icon nzType="more"></span>
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [`
    .data-table-container {
      background: white;
      border-radius: 6px;
      overflow: hidden;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading = false;
  @Input() showPagination = true;
  @Input() showSearch = true;
  @Input() paginationPosition: 'top' | 'bottom' | 'both' = 'bottom';
  @Input() scroll: { x?: string; y?: string } = {};
  @Input() actions: TableAction[] = [];
  @Input() rowActions: TableAction[] = [];

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();
  @Output() sortChange = new EventEmitter<{ key: string; value: 'ascend' | 'descend' | null }>();
  @Output() filterChange = new EventEmitter<{ key: string; value: any }>();
  @Output() searchChange = new EventEmitter<string>();

  filteredData: any[] = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  searchValue = '';

  ngOnInit() {
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.updateData();
    }
  }

  private updateData() {
    this.filteredData = [...this.data];
    this.total = this.data.length;
    this.applyFilters();
  }

  onQueryParamsChange(params: any) {
    const { pageIndex, pageSize, sort, filter } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.pageChange.emit({ pageIndex, pageSize });

    if (sort) {
      const sortParam = sort.find((s: any) => s.value !== null);
      if (sortParam) {
        this.sortChange.emit({ key: sortParam.key, value: sortParam.value });
      }
    }

    if (filter) {
      Object.keys(filter).forEach(key => {
        if (filter[key]) {
          this.filterChange.emit({ key, value: filter[key] });
        }
      });
    }
  }

  sortFn(key: string) {
    return (a: any, b: any) => a[key].localeCompare(b[key]);
  }

  onSearch() {
    this.searchChange.emit(this.searchValue);
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.data];
    if (this.searchValue) {
      filtered = filtered.filter(item =>
        Object.values(item).some(val =>
          val?.toString().toLowerCase().includes(this.searchValue.toLowerCase())
        )
      );
    }
    this.filteredData = filtered;
    this.total = filtered.length;
  }
}