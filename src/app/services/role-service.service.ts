import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';  // Import ApiGatewayService
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {

  private apiUrl = 'PermissionMaster';
  private rolePermissionsUrl = 'RolePermissions/AllRoles';
  private newRolePermissionsUrl = 'RolePermissions/GetPermissionsForNew';
  private rolePermissionsUpdateUrl = 'RolePermissions';  // Base URL for update

  constructor(private apiGatewayService: ApiGatewayService, private authservice: AuthServiceService) { }

  // Using ApiGatewayService for API calls
  createPermission(payload: any): Observable<any> {
    return this.apiGatewayService.post(this.apiUrl, payload);
  }

  // getRolePermissions(): Observable<any[]> {
  //   return this.apiGatewayService.get<any[]>(this.rolePermissionsUrl);
  // }


  getRolePermissions(): Observable<any[]> {
    const token = this.authservice.getToken();  // Retrieve the stored token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Add the token to the headers
    });

    // Create an empty HttpParams object (can add query params here if needed)
    const params = new HttpParams();

    // Now call ApiGatewayService.get with the correct headers and params
    return this.apiGatewayService.get<any[]>(this.rolePermissionsUrl, params, headers);
  }



  // getPermissionsForNewRole(): Observable<any[]> {
  //   return this.apiGatewayService.get<any[]>(this.newRolePermissionsUrl);
  // }
  getPermissionsForNewRole(): Observable<any[]> {
    const token = this.authservice.getToken();  // Retrieve the stored token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Add the token to the headers
    });

    // Create an empty HttpParams object (can add query params here if needed)
    const params = new HttpParams();

    // Now call ApiGatewayService.get with the correct headers and params
    return this.apiGatewayService.get<any[]>(this.newRolePermissionsUrl, params, headers);
  }
  // getPermissionsForRole(rolePermissionId: number): Observable<any[]> {
  //   const url = `RolePermissions/${rolePermissionId}`;
  //   return this.apiGatewayService.get<any[]>(url);
  // }

  getPermissionsForRole(rolePermissionId: number): Observable<any[]> {
    const token = this.authservice.getToken();  // Retrieve the stored token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Add the token to the headers
    });

    const url = `RolePermissions/${rolePermissionId}`;
    return this.apiGatewayService.get<any[]>(url, new HttpParams(), headers);  // Pass headers for authentication
  }

  addRolePermissions(rolePermissionName: string, rolePermission: any[]): Observable<any> {
    const url = `RolePermissions/${rolePermissionName}`;
    return this.apiGatewayService.post(url, rolePermission);
  }

  // updateRolePermissions(rolePermissionId: number, updatedPermissions: any[]): Observable<any> {
  //   const url = `${this.rolePermissionsUpdateUrl}/${rolePermissionId}`;
  //   return this.apiGatewayService.put(url, updatedPermissions);
  // }

  updateRolePermissions(rolePermissionId: number, updatedPermissions: any[]): Observable<any> {
    const token = this.authservice.getToken();  // Retrieve the stored token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Add the token to the headers
    });

    const url = `${this.rolePermissionsUpdateUrl}/${rolePermissionId}`;
    return this.apiGatewayService.put(url, updatedPermissions, headers);  // Pass headers for authentication
  }

}
