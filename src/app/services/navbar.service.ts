import { Injectable } from '@angular/core';
import { PermissionService } from './permission.service';
import { navbarData } from '../components/side-nav/nav-data';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  constructor(private permissionService: PermissionService) { }

  getNavbarItems() {
    return navbarData.filter((item) =>
      !item.requiredPermission || this.permissionService.hasPermission(item.requiredPermission)
    );
  }
}
