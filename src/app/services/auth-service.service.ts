import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private baseUrl = 'http://13.233.79.234:8080/api/Auth';

  constructor(private http: HttpClient) { }

  /**
   * Login method to authenticate the user
   * @param email Email for login
   * @param password Password for login
   * @param organizationCode Organization code for login
   */
  login(email: string, password: string, organizationCode: string): Observable<any> {
    const url = `${this.baseUrl}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&organizationCode=${encodeURIComponent(
      organizationCode
    )}`;
    return this.http.post<any>(url, {});
  }

  /**
   * Forgot Password method to send OTP to the user's email
   * @param email Email to send OTP
   * @param organizationCode Organization code
   */
  forgotPassword(email: string, organizationCode: string): Observable<any> {
    const url = `${this.baseUrl}/forgot-password?email=${encodeURIComponent(email)}&organizationCode=${encodeURIComponent(organizationCode)}`;
    return this.http.post<any>(url, {}, { responseType: 'text' as 'json' });  // Set responseType to text
  }

  /**
   * Reset Password method to update the user's password
   * @param email User's email
   * @param otp OTP received via email
   * @param newPassword New password to set
   * @param organizationCode Organization code
   */
  resetPassword(email: string, otp: string, newPassword: string, organizationCode: string): Observable<any> {
    const url = `${this.baseUrl}/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(newPassword)}&organizationCode=${encodeURIComponent(organizationCode)}`;
    return this.http.post<any>(url, {}, { responseType: 'text' as 'json' }); // Setting responseType to 'text' to handle plain text response
  }


  /**
   * Save token in localStorage
   * @param token Authentication token to save
   */
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Retrieve token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  isLoggedIn(): boolean {
    return !!this.getToken(); // Returns true if a token exists, otherwise false
  }
  /**
   * Logout by clearing the token
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }
}
