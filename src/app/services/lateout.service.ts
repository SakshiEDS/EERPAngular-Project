import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LateoutService {

  private lateInApiUrl = 'http://13.233.79.234:8080/api/LateinRule';
  private earlyOutApiUrl = 'http://13.233.79.234:8080/api/EarlyOutRule';
  private apiUrl = 'http://13.233.79.234:8080/api/EarlyOutRule';

  constructor(private http: HttpClient) { }

  // Get next serial number for LateInRule
  getNextSerialNumberLateIn(): Observable<number> {
    return this.http.get<number>(`${this.lateInApiUrl}/nextSerialNumber`);
  }

  // Save LateInRule data
  saveLateInRule(data: any): Observable<any> {
    return this.http.post<any>(this.lateInApiUrl, data);
  }

  // Get next serial number for EarlyOutRule
  getNextSerialNumberEarlyOut(): Observable<number> {
    return this.http.get<number>(`${this.earlyOutApiUrl}/nextSerialNumber`);
  }

  // Save EarlyOutRule data
  saveEarlyOutRule(data: any): Observable<any> {
    return this.http.post<any>(this.earlyOutApiUrl, data);
  }
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Returns the items from the API
  }
  getLateInItems(): Observable<any[]> {
    return this.http.get<any[]>(this.lateInApiUrl);  // Returns the LateIn rule items from the API
  }
  updateLateInRule(sno: number, data: any) {
    return this.http.put(`http://13.233.79.234:8080/api/LateInRule/${sno}`, data);
  }

  updateEarlyOutRule(sno: number, data: any) {
    return this.http.put(`http://13.233.79.234:8080/api/EarlyOutRule/${sno}`, data);
  }
  deleteLateInRule(sno: number): Observable<any> {
    return this.http.delete<any>(`${this.lateInApiUrl}/${sno}`);
  }

  // Delete EarlyOutRule by sno
  deleteEarlyOutRule(sno: number): Observable<any> {
    return this.http.delete<any>(`${this.earlyOutApiUrl}/${sno}`);
  }
}
