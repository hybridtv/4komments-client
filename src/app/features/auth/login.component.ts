import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from './auth.service';
import { LoginDto } from '../../models/login.dto';
import { RegisterDto } from '../../models/register.dto';
import { NotificationService } from '../../shared/services/notification.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { StateService } from '../../shared/services/state.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule,
    NzAlertModule
  ],
  template: `
    <div class="auth-container">
      <h2>Login</h2>
      <form nz-form [formGroup]="loginForm" (ngSubmit)="onLogin()">
        <nz-form-item>
          <nz-form-label nzRequired>Username</nz-form-label>
          <nz-form-control nzErrorTip="Please input your username!">
            <input nz-input formControlName="username" placeholder="Username" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzRequired>Password</nz-form-label>
          <nz-form-control nzErrorTip="Please input your password!">
            <input nz-input type="password" formControlName="password" placeholder="Password" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control>
            <button nz-button nzType="primary" nzBlock [nzLoading]="(isLoading$ | async)" [disabled]="loginForm.invalid">Login</button>
          </nz-form-control>
        </nz-form-item>
      </form>
      <h2>Register</h2>
      <form nz-form [formGroup]="registerForm" (ngSubmit)="onRegister()">
        <nz-form-item>
          <nz-form-label nzRequired>Username</nz-form-label>
          <nz-form-control nzErrorTip="Please input your username!">
            <input nz-input formControlName="username" placeholder="Username" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzRequired>Password</nz-form-label>
          <nz-form-control nzErrorTip="Please input your password!">
            <input nz-input type="password" formControlName="password" placeholder="Password" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>Name</nz-form-label>
          <nz-form-control>
            <input nz-input formControlName="name" placeholder="Name (optional)" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-control>
            <button nz-button nzType="primary" nzBlock [nzLoading]="(isLoading$ | async)" [disabled]="registerForm.invalid">Register</button>
          </nz-form-control>
        </nz-form-item>
      </form>
      <nz-alert *ngIf="errorMessage" nzType="error" [nzMessage]="errorMessage" nzShowIcon nzClosable (nzOnClose)="errorMessage = ''"></nz-alert>
    </div>
  `,
  styles: [`
    .auth-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private stateService = inject(StateService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  registerForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    name: ['']
  });

  isLoading$ = this.stateService.isLoading$;
  errorMessage = '';

  onLogin() {
    if (this.loginForm.valid) {
      this.stateService.setLoading(true);
      const credentials: LoginDto = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: () => {
          this.stateService.setLoading(false);
          this.notificationService.successMessage('Login successful');
          this.router.navigate(['/comments']);
        },
        error: (error) => {
          this.stateService.setLoading(false);
          this.errorHandler.handleError(error);
        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.stateService.setLoading(true);
      const user: RegisterDto = this.registerForm.value;
      this.authService.register(user).subscribe({
        next: () => {
          this.stateService.setLoading(false);
          this.notificationService.successMessage('Registration successful. Please login.');
          this.registerForm.reset();
        },
        error: (error) => {
          this.stateService.setLoading(false);
          this.errorHandler.handleError(error);
        }
      });
    }
  }
}