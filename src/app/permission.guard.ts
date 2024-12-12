import { CanActivateFn } from '@angular/router';

export const permissionGuard: CanActivateFn = (route, state) => {
  return true;
};
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { AuthService } from './auth.service'; // Assuming AuthService handles user login and permissions
import { PermissionService } from './services/permission.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private authService: PermissionService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const requiredPermission = next.data['permission'];
    console.log('Checking permission for route:', requiredPermission);

    if (this.authService.hasPermission(requiredPermission)) {
      console.log('Permission granted for route:', requiredPermission);
      return true;
    }

    console.log('Permission denied for route:', requiredPermission);
    this.router.navigate(['/forbidden']);
    return false;
  }

}
