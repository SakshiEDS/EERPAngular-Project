import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissions: any[] = [];

  constructor() {
    this.loadPermissions();
  }

  // Load permissions from localStorage
  loadPermissions(): void {
    const storedPermissions = localStorage.getItem('permissions');
    if (storedPermissions) {
      this.permissions = JSON.parse(storedPermissions);
    }
  }

  // Check if a permission exists
  hasPermission(permissionName: string, description?: string): boolean {
    return this.permissions.some(
      (permission) =>
        permission.name === permissionName &&
        permission.activeStatus &&
        (!description || permission.description === description)
    );
  }

}
