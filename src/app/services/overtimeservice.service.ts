import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';  // Import ApiGatewayService
// Import OvertimeItem interface
export interface OvertimeItem {
  sno: number;
  overtimeName: string;
  minimumOtHours: number;
  overtimeFor: string;
  workingHoursPerMonth: number;
  roundOff: string;
  overtimeApplicableStatus: boolean;
  overtimeType: string;
}

@Injectable({
  providedIn: 'root'
})
export class OvertimeserviceService {

  private apiUrl = 'Overtime'; // API route without the base URL part
  private apiurl = 'AttendanceCorrection/correct';

  constructor(private apiGatewayService: ApiGatewayService) { }

  // Fetch Overtime data
  getOvertimeItems(): Observable<OvertimeItem[]> {
    return this.apiGatewayService.get<OvertimeItem[]>(this.apiUrl); // Use ApiGatewayService for GET
  }

  // Save Overtime data (both for create and update)
  saveOvertime(overtimeData: OvertimeItem): Observable<any> {
    const url = overtimeData.sno ? `${this.apiUrl}/${overtimeData.sno}` : this.apiUrl; // Define URL based on sno
    const method = overtimeData.sno ? 'put' : 'post'; // Determine if we are updating or creating

    return this.apiGatewayService[method](url, overtimeData); // Call the appropriate method (put/post)
  }

  // Delete Overtime data
  deleteOvertime(sno: number): Observable<any> {
    const url = `${this.apiUrl}/${sno}`; // Define URL with sno for deletion
    return this.apiGatewayService.delete<any>(url); // Call delete method from ApiGatewayService
  }
  submitAttendanceCorrection(payload: any): Observable<any> {
    return this.apiGatewayService.post<any>(this.apiurl, payload);  // Call post method of ApiGatewayService
  }
}
