import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service'; // Import ApiGatewayService

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'EmpAttendance/getCompleteAttendance'; // API route

  constructor(private apiGateway: ApiGatewayService) { } // Inject ApiGatewayService

  // Fetch employee attendance data based on employee ID, year, and month
  getEmployeeAttendance(employeeId: number, year: string, month: string): Observable<any> {
    const route = `${this.apiUrl}${employeeId}/${year}/${month}`; // Construct the route
    return this.apiGateway.get<any>(route); // Use ApiGatewayService's get() method
  }
}
