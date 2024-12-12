import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private apiUrl = 'UserDetails';  // Adjusted to match the API URL path without the base URL
  private apiurl = 'EmpDetails';  // Adjusted to match the API URL path for employee details

  constructor(private apiGateway: ApiGatewayService) { }

  // Method to fetch employee details by empCode
  getEmployeeDetailsByCode(empCode: string): Observable<any> {
    const route = `UserDetails/EmpCode/${empCode}`; // Adjust API route to match the structure
    return this.apiGateway.get<any>(route); // Use ApiGatewayService for GET request
  }

  // Method to save user data
  saveUserData(userData: any): Observable<any> {
    const route = 'UserDetails'; // Adjust API route
    return this.apiGateway.post<any>(route, userData); // Use ApiGatewayService for POST request
  }

  // Fetch all employee data
  getAllEmployeeData(): Observable<any[]> {
    const route = 'UserDetails'; // Adjust API route
    return this.apiGateway.get<any[]>(route); // Use ApiGatewayService for GET request
  }

  // Method to update user data
  updateUserData(empCode: string, userData: any): Observable<any> {
    const route = `UserDetails/${empCode}`; // Adjust API route
    return this.apiGateway.put<any>(route, userData); // Use ApiGatewayService for PUT request
  }

  // Method to get employee name by empCode
  getEmployeeNameByCode(empCode: string): Observable<string | null> {
    const route = `EmpDetails/${empCode}`; // Adjust API route for employee name
    return this.apiGateway.get<any>(route).pipe(
      map((response) => response?.empDetail?.empName || null) // Extract the employee name
    );
  }
}
