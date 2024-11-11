import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable
import { EmployeeData } from './components/employe-detail-modal/employe-detail-modal';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private apiUrl = 'http://13.233.79.234/eERPapi/api/EmpDetails'; // Replace with your API URL
  private apiUrl = 'https://localhost:7238/api/EmpDetails'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  // Method to send emergency contact data to the API
  postEmployeeData(employeeData: EmployeeData): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl, employeeData, { headers: headers });
  }
}