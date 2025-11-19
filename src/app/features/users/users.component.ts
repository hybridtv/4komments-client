import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table/data-table.component';
import { ModalFormComponent, FormField } from '../../shared/components/modal-form/modal-form.component';
import { UsersService } from './users.service';
import { User } from '../../models/user.model';
import { RegisterDto } from '../../models/register.dto';
import { UserStateTypes } from '../../models/states.enum';
import { NotificationService } from '../../shared/services/notification.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    NzAlertModule,
    NzButtonModule,
    DataTableComponent,
    ModalFormComponent
  ],
  template: `
    <div class="users-container">
      <h2>Users Management</h2>
      <nz-spin [nzSpinning]="loading">
        <app-data-table
          [data]="displayUsers"
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
    .users-container {
      padding: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);
  private notificationService = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);

  users: User[] = [];
  displayUsers: any[] = [];
  loading = false;
  errorMessage = '';
  modalVisible = false;
  modalTitle = '';
  modalData: any = {};
  selectedUser: User | null = null;

  columns: TableColumn[] = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'username', title: 'Username', sortable: true },
    { key: 'name', title: 'Name' },
    { key: 'state', title: 'State', sortable: true }
  ];

  tableActions: TableAction[] = [
    {
      label: 'New User',
      icon: 'plus',
      type: 'primary',
      action: () => this.openNewUserModal()
    }
  ];

  rowActions: TableAction[] = [
    {
      label: 'Toggle State',
      icon: 'swap',
      action: (item: any) => this.toggleState(item.id)
    },
    {
      label: 'Edit',
      icon: 'edit',
      action: (item: any) => this.openEditUserModal(item.id)
    },
    {
      label: 'Delete',
      icon: 'delete',
      action: (item: any) => this.deleteUser(item.id)
    }
  ];

  modalFields: FormField[] = [
    {
      key: 'username',
      label: 'Username',
      type: 'input',
      required: true
    },
    {
      key: 'password',
      label: 'Password',
      type: 'input'
    },
    {
      key: 'name',
      label: 'Name',
      type: 'input',
      required: true
    }
  ];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.displayUsers = users.map(u => ({
          ...u,
          state: this.getStateLabel(u.state)
        }));
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  getStateLabel(state: UserStateTypes): string {
    switch (state) {
      case UserStateTypes.PUBLIC: return 'Public';
      case UserStateTypes.INACTIVE: return 'Inactive';
      case UserStateTypes.ACTIVE: return 'Active';
      case UserStateTypes.ADMIN: return 'Admin';
      default: return 'Unknown';
    }
  }

  toggleState(id: number) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      const newState = user.state === UserStateTypes.ACTIVE ? UserStateTypes.INACTIVE : UserStateTypes.ACTIVE;
      const updatedUser: User = { ...user, state: newState };
      this.usersService.updateUser(id, updatedUser).subscribe({
        next: () => {
          this.notificationService.successMessage('User state updated');
          this.loadUsers();
        },
        error: (error) => this.errorHandler.handleError(error)
      });
    }
  }

  openNewUserModal() {
    this.modalTitle = 'New User';
    this.modalData = {};
    this.modalVisible = true;
  }

  openEditUserModal(id: number) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      this.modalTitle = 'Edit User';
      this.modalData = { ...user };
      this.modalVisible = true;
    }
  }

  onModalSubmit(data: any) {
    if (this.modalTitle === 'New User') {
      const dto: RegisterDto = {
        username: data.username,
        password: data.password,
        name: data.name
      };
      this.usersService.createUser(dto).subscribe({
        next: () => {
          this.notificationService.successMessage('User created');
          this.modalVisible = false;
          this.loadUsers();
        },
        error: (error) => this.errorHandler.handleError(error)
      });
    } else {
      const user: User = {
        id: data.id,
        username: data.username,
        name: data.name,
        state: data.state
      };
      this.usersService.updateUser(data.id, user).subscribe({
        next: () => {
          this.notificationService.successMessage('User updated');
          this.modalVisible = false;
          this.loadUsers();
        },
        error: (error) => this.errorHandler.handleError(error)
      });
    }
  }

  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe({
      next: () => {
        this.notificationService.successMessage('User deleted');
        this.loadUsers();
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