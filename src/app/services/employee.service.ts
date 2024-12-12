import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeData } from '../components/employe-detail-modal/employe-detail-modal';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'EmpDetails'; // Relative path for employee endpoint
  private departmentApiUrl = 'Department'; // Relative path for department endpoint
  private designationApiUrl = 'Designation'; // Relative path for designation endpoint

  constructor(private apiGateway: ApiGatewayService) { }

  /**
   * POST Employee Data
   */
  postEmployeeData(employeeData: EmployeeData): Observable<any> {
    return this.apiGateway.post<any>(this.apiUrl, employeeData).pipe(
      catchError((error) => {
        console.error('Error posting employee data:', error);
        return throwError(() => new Error('Failed to post employee data'));
      })
    );
  }





  /**
   * GET Employee Data with department and designation mapping
   */
  getEmployeeData(): Observable<EmployeeData[]> {
    return forkJoin({
      employeeData: this.apiGateway.get<any>(this.apiUrl),
      departmentData: this.apiGateway.get<any[]>(this.departmentApiUrl),
      designationData: this.apiGateway.get<any[]>(this.designationApiUrl)
    }).pipe(
      map(({ employeeData, departmentData, designationData }) =>
        employeeData.empDetail.map((empDetail: any) => {
          // Safely access empOfficialInformation and empPostingAttachment
          const empOfficialInfo = employeeData.empOfficialInformation?.find(
            (info: any) => info.empCode === empDetail.empCode
          ) || null;

          const empPostingAttachment = employeeData.empPostingAttachment?.find(
            (attachment: any) => attachment.empCode === empDetail.empCode
          ) || null;

          // Match department code to department name
          const department = departmentData?.find(
            (dept: any) => dept.sno === empPostingAttachment?.empDepartmentCode
          );

          // Match designation code to designation name
          const designation = designationData?.find(
            (des: any) => des.sno === empPostingAttachment?.empDesignationCode
          );

          return {
            sNo: empDetail.sno,
            code: empDetail.empCode,
            name: empDetail.empName,
            department: department?.departmentName || 'N/A',
            designation: designation?.designationName || 'N/A',
            joiningDate: empOfficialInfo?.empJoiningDate || 'N/A',
            leavingDate: empOfficialInfo?.empConfirmationDate || 'N/A'
          };
        })
      )
    );
  }


  /**
   * PUT (Update) Employee Data
   */
  updateEmployeeData(id: number, updatedData: EmployeeData): Observable<any> {
    return this.apiGateway.put<any>(`${this.apiUrl}/${id}`, updatedData);
  }

  /**
   * GET Employee Details by Employee Code
   */
  getEmployeeDetailsByCode(empCode: string): Observable<any> {
    return forkJoin({
      employeeData: this.apiGateway.get<any>(`${this.apiUrl}/${empCode}`),
      departmentData: this.apiGateway.get<any[]>(this.departmentApiUrl),
      designationData: this.apiGateway.get<any[]>(this.designationApiUrl)
    }).pipe(
      map(({ employeeData, departmentData, designationData }) => {
        const empOfficialInfo = employeeData.empOfficialInformation;
        const empPostingAttachment = employeeData.empPostingAttachment;

        // Match department code to department name
        const department = departmentData.find(
          (dept: any) => dept.sno === empPostingAttachment?.empDepartmentCode
        );

        // Match designation code to designation name
        const designation = designationData.find(
          (des: any) => des.sno === empPostingAttachment?.empDesignationCode
        );

        return {
          joiningDate: empOfficialInfo?.empJoiningDate || 'N/A',
          confirmationDate: empOfficialInfo?.empConfirmationDate || 'N/A',
          department: department?.departmentName || 'N/A',
          designation: designation?.designationName || 'N/A',
          reportingTo: empPostingAttachment?.empReportingTo || null // Ensure reportingTo is included
        };
      })
    );
  }

  /**
   * GET Employee Name by Employee Code
   */
  getEmployeeNameByCode(empCode: string): Observable<string | null> {
    return this.apiGateway.get<any>(`${this.apiUrl}/${empCode}`).pipe(
      map((response) => response?.empDetail?.empName || null) // Map to employee name if found
    );
  }

  /**
   * GET All Employee Data
   */
  getAllEmployeeData(): Observable<any[]> {
    return this.apiGateway.get<any>(this.apiUrl).pipe(
      map(response => response.empDetail || []) // Ensure the array is returned
    );
  }
  getEmployeeDetails(id: number): Observable<any> {
    return this.apiGateway.get<any>(`${this.apiUrl}/${id}`);
  }
  /**
   * GET Employee Emergency Contact (Email and Mobile) by Employee Code
   */
  getEmployeeEmergencyContactByCode(empCode: string): Observable<{ email: string | null, mobile: string | null }> {
    return this.apiGateway.get<any>(`${this.apiUrl}/${empCode}`).pipe(
      map((response) => ({
        email: response?.empDetail?.empEmergencyEmail || null, // If email is found, return it, else return null
        mobile: response?.empDetail?.empEmergencyPhoneNo || null // If mobile is found, return it, else return null
      }))
    );
  }

  getNextSerialNumber(): Observable<number> {
    return this.apiGateway.get<number>(`${this.apiUrl}/nextSerialNumber`).pipe(
      catchError((error) => {
        console.error('Error fetching the next serial number:', error);
        return throwError(() => new Error('Failed to fetch the next serial number'));
      })
    );
  }

}



