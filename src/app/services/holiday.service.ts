import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  private apiUrl = 'HolidayList/AddHoliday'; // Relative API route
  private apiUrlGetHolidays = 'HolidayList/GetAllHolidays';
  private apiUrlDeleteHoliday = 'HolidayList/DeleteHoliday';
  private apiUrlUpdateHoliday = 'HolidayList/EditHoliday'; // Relative API route for updating holiday
  private apiUrlGetHolidaysByYear = 'HolidayList/GetHolidaysByYear'; // Relative API route for fetching by year

  private refreshSubject = new Subject<void>(); // Event for refresh
  // Observable for components to subscribe to
  refresh$ = this.refreshSubject.asObservable();

  constructor(private apiGateway: ApiGatewayService) { }

  // Method to trigger refresh
  triggerRefresh() {
    this.refreshSubject.next();
  }

  // Method to post holiday data
  addHoliday(holidayData: any): Observable<any> {
    return this.apiGateway.post<any>(this.apiUrl, holidayData);
  }

  // Method to get all holidays
  getHolidays(): Observable<any[]> {
    return this.apiGateway.get<any[]>(this.apiUrlGetHolidays);
  }

  // Method to delete a holiday
  deleteHoliday(id: number): Observable<any> {
    const url = `${this.apiUrlDeleteHoliday}/${id}`; // Relative route for deletion
    return this.apiGateway.delete<any>(url);
  }

  // Method to update a holiday
  updateHoliday(id: number, holidayData: any): Observable<any> {
    const url = `${this.apiUrlUpdateHoliday}/${id}`; // Construct the relative route
    return this.apiGateway.put<any>(url, holidayData);
  }

  // Method to get holidays by year
  getHolidaysByYear(year: number): Observable<any[]> {
    const url = `${this.apiUrlGetHolidaysByYear}/${year}`; // Construct the relative route
    return this.apiGateway.get<any[]>(url);
  }
}
