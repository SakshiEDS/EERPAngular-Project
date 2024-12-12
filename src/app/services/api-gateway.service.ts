import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiGatewayService {

  private baseUrl: string = 'http://localhost:5020/api/';

  constructor(private http: HttpClient, private router: Router, private authService: AuthServiceService) { }

  /**
   * GET Request
   * @param route API route to append to the base URL
   * @param params Optional HTTP parameters
   * @param headers Optional HTTP headers
   */
  get<T>(route: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${route}`, { params, headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * POST Request
   * @param route API route to append to the base URL
   * @param body Request body
   * @param headers Optional HTTP headers
   */
  post<T>(route: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${route}`, body, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * PUT Request
   * @param route API route to append to the base URL
   * @param body Request body
   * @param headers Optional HTTP headers
   */
  put<T>(route: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${route}`, body, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * DELETE Request
   * @param route API route to append to the base URL
   * @param params Optional HTTP parameters
   */
  delete<T>(route: string, params?: HttpParams): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${route}`, { params }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Handle HTTP errors
   * @param error HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401 || error.status === 403) {
      // Notify the user about the error
      // alert('Your session has expired. Please log in again.');

      // // Perform logout and redirect
      // this.authService.logout();
      // this.router.navigate(['/login']);
    } else {
      // Optional: Handle other error types here, if necessary
      console.error('An error occurred:', error.message);
    }

    return throwError(error); // Propagate the error to the caller
  }
}
