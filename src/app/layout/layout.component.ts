import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../features/auth/auth.service';
import { StateService } from '../shared/services/state.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, NzLayoutModule, NzMenuModule, NzIconModule, NzButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private stateService = inject(StateService);
  private router = inject(Router);

  isCollapsed = false;
  currentUser: User | null = null;

  ngOnInit() {
    this.stateService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
