import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveMasterService {
  private apiUrl = 'LeavesMaster'; // Relative API route
  private nextSnoUrl = 'LeaveApplication/next-sno';
  private leaveApplicationUrl = 'LeaveApplication';
  private leaveAdjustmentNextSnoUrl = 'LeaveAdjustment/next-sno';
  private leaveDetailsUrl = 'EmpLeaveDetails/LeaveType';
  private nextSerialNumberUrl = 'LeavesMaster/nextSerialNumber';
  private leaveAdjustmentUrl = 'LeaveAdjustment';
  private leaveApplicationSubmitUrl = 'LeaveApplication/HrLeaveapply';
  private leaveActionUrl = 'LeaveAction';
  private weekOffDetailsUrl = 'WeekOffDetails';

  constructor(private apiGateway: ApiGatewayService) { }

  createLeave(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiGateway.post(`${this.apiUrl}`, data);
  }

  getLeaves(): Observable<any[]> {
    return this.apiGateway.get<any[]>(this.apiUrl);
  }

  deleteLeave(sno: number): Observable<any> {
    return this.apiGateway.delete(`${this.apiUrl}/${sno}`);
  }
  updateLeave(sno: number, data: any): Observable<any> {
    const url = `${this.apiUrl}/${sno}`; // Construct the URL dynamically
    return this.apiGateway.put(url, data);
  }



  getNextSno(): Observable<{ nextSno: number }> {
    return this.apiGateway.get<{ nextSno: number }>(this.nextSnoUrl);
  }

  getLeaveApplications(): Observable<any[]> {
    return this.apiGateway.get<any[]>(this.leaveApplicationUrl);
  }

  getLeaveAdjustmentNextSno(): Observable<{ nextSno: number }> {
    return this.apiGateway.get<{ nextSno: number }>(this.leaveAdjustmentNextSnoUrl);
  }

  getEmpLeaveDetails(empCode: number): Observable<any> {
    return this.apiGateway.get<any>(`${this.leaveDetailsUrl}/${empCode}`);
  }

  getLeaveTypes(): Observable<any> {
    return this.apiGateway.get<any>(this.apiUrl);
  }

  getEndOfServiceNextSerialNumber(): Observable<{ nextSerialNumber: number }> {
    const url = 'EmpDetails/EndOfService/nextSerialNumber';
    return this.apiGateway.get<{ nextSerialNumber: number }>(url);
  }

  saveEndOfServiceAdjustment(data: any): Observable<any> {
    const url = 'EmpDetails/EndOfService';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiGateway.post<any>(url, data);
  }

  getEmpReviewRemarkNextSerialNumber(): Observable<{ nextSerialNumber: number }> {
    const url = 'EmpReviewRemark/nextSerialNumber';
    return this.apiGateway.get<{ nextSerialNumber: number }>(url);
  }

  saveEmpReviewRemark(data: any): Observable<any> {
    const url = 'EmpReviewRemark';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiGateway.post<any>(url, data);
  }

  updateWeekOffDetails(weekOffDetails: any[]): Observable<any> {
    const url = `${this.weekOffDetailsUrl}/UpdateWeekOffStatus`;
    return this.apiGateway.post(url, weekOffDetails);
  }

  getWeekOffDetails(): Observable<any[]> {
    return this.apiGateway.get<any[]>(this.weekOffDetailsUrl);
  }

  getLeaveTypesForEmployee(empCode: number): Observable<any[]> {
    const url = `${this.leaveDetailsUrl}/${empCode}`;
    return this.apiGateway.get<any[]>(url);
  }

  getNextSerialNumber(): Observable<{ sno: number }> {
    return this.apiGateway.get<{ sno: number }>(this.nextSerialNumberUrl);
  }

  saveLeaveAdjustment(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiGateway.post(this.leaveAdjustmentUrl, data);
  }

  submitLeaveApplication(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiGateway.post(this.leaveApplicationUrl, data);
  }

  submitHRApplication(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiGateway.post(this.leaveApplicationSubmitUrl, payload);
  }

  getLeaveDetails(leaveRequestCode: number): Observable<any> {
    return this.apiGateway.get<any>(`${this.leaveApplicationUrl}/${leaveRequestCode}`);
  }

  approveLeave(voucherNo: number, remark: string, data: any): Observable<any> {
    const url = `${this.leaveActionUrl}/Approve/${voucherNo}/${remark}`;
    return this.apiGateway.post(url, data);
  }

  rejectLeave(voucherNo: number, remark: string, data: any): Observable<any> {
    const url = `${this.leaveActionUrl}/Reject/${voucherNo}/${remark}`;
    return this.apiGateway.post(url, data);
  }
}
