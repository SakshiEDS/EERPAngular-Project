import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiGatewayService } from './api-gateway.service';  // Ensure correct path
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {


  constructor(private apiGateway: ApiGatewayService, private http: HttpClient) { }

  // Method to fetch the next serial number
  getMaxSerialNumber(): Observable<number> {
    return this.apiGateway.get<number>('OrganizationInfo/max-serial-number');
  }

  // Method to submit the form data
  submitForm(payload: any): Observable<any> {
    return this.apiGateway.post<any>('OrganizationInfo', payload);
  }

  // Method to fetch the country code data
  getCountryCodes(): Observable<any[]> {
    return this.apiGateway.get<any[]>('CountryCode');
  }


  checkPhoneNumberExists(phoneNumber: string): Observable<boolean> {
    return this.apiGateway.get<string[]>('OrganizationInfo/mobile-numbers').pipe(
      map(existingPhoneNumbers => existingPhoneNumbers.includes(phoneNumber))
    );
  }

  // Method to check if email exists
  checkEmailExists(email: string): Observable<boolean> {
    return this.apiGateway.get<string[]>('OrganizationInfo/email-ids').pipe(
      map(existingEmails => existingEmails.includes(email))
    );
  }


  getExistingOrganizationData(): Observable<any> {
    return this.apiGateway.get<any>('OrganizationInfo');
  }

  verifyOtp(payload: { email: string, otp: string }): Observable<any> {
    return this.apiGateway.post<any>('OrganizationInfo/verify-otp', payload);
  }

  resendOtp(email: string): Observable<any> {
    return this.apiGateway.get<any>('OrganizationInfo/resend-otp', new HttpParams().set('email', email));
  }
}
