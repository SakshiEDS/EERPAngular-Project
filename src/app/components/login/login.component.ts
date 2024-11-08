import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginId: string = '';
  userName: string = '';

  constructor(private http: HttpClient) { }

  messages: Message[] = [];


  onSubmit() {
    const loginData = {
      'LoginId': this.loginId,
      'Password': this.userName
    };

    this.http.post('http://13.233.79.234/ApplicationApi/api/Login/', loginData, {
      headers: { 'Content-Type': 'application/json' }
    })
      .subscribe(
        response => {
          this.messages = [{ severity: 'success', summary: 'Success', detail: 'Login successful' }];
        },
        error => {
          console.error('Login failed:', error);
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Login failed' }];
        }
      );
  }
}
