import { Component } from '@angular/core';
import { EmployeDetailModalComponent } from './components/employe-detail-modal/employe-detail-modal.component';
import { NavigationEnd, Router } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ERPMarket';
  constructor(private router: Router, public authService: AuthServiceService) { }
  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  isExcludedPage(): boolean {
    const excludedRoutes = ['/', '/login', '/organisation']; // Add all routes you want to exclude
    return excludedRoutes.includes(this.router.url);
  }
}

