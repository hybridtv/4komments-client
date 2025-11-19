import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'comments',
    loadComponent: () => import('./features/comments/comments.component').then(m => m.CommentsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'audits',
    loadComponent: () => import('./features/audits/audits.component').then(m => m.AuditsComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/history.component').then(m => m.HistoryComponent),
    canActivate: [AdminGuard]
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];
