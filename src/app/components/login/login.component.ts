import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  displayForgotPasswordDialog: boolean = false;
  otp: string = '';  // To hold OTP entered by the user
  newPassword: string = '';
  activeCard: string = 'card1'; // Default card

  switchCard(card: string) {
    this.activeCard = card;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,  // Inject your AuthService
    private router: Router,

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Validate email
      password: ['', [Validators.required, Validators.minLength(6)]],  // Validate password
      organizationCode: ['', [Validators.required]]  // Validate organisation code
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, organizationCode } = this.loginForm.value;

      // Call the AuthService to perform login with POST request
      this.authService.login(email, password, organizationCode).subscribe(
        (response) => {
          const token = response.token;  // Get the token from the response
          const permissions = response.permissions;  // Get the permissions from the response

          // Save token and permissions in localStorage
          this.authService.saveToken(token);
          localStorage.setItem('permissions', JSON.stringify(permissions));  // Save permissions

          console.log('JWT Token:', token);  // Display token in the console
          console.log('Permissions:', permissions);  // Display permissions in the console

          alert('Login Successful!');
          this.router.navigate(['/side-nav']); // Redirect to the dashboard or another route
        },
        (error) => {
          this.errorMessage = 'Invalid login credentials';
          console.error('Login error:', error);
        }
      );
    }
  }

  onForgotPassword(): void {
    const { email, organizationCode } = this.loginForm.value;
    if (!email || !organizationCode) {
      alert('Please fill out the email and organization code fields.');
      return;
    }

    // Call the service to send OTP
    this.authService.forgotPassword(email, organizationCode).subscribe(
      (response) => {
        console.log('OTP Response:', response);  // Log the full response for debugging

        if (response === 'OTP sent to your email.') {
          alert('OTP sent to your email.');
          this.displayForgotPasswordDialog = true;  // Open the dialog
        } else {
          alert('Failed to send OTP. Please try again.');
        }
      },
      (error) => {
        // Log the error for debugging
        console.error('Error in forgot password request:', error);

        // Check if the error is from the backend response
        if (error.status === 200 && error.error === 'OTP sent to your email.') {
          alert('OTP sent to your email.');
          this.displayForgotPasswordDialog = true;
        } else {
          alert('Failed to send OTP. Please try again.');
        }
      }
    );
  }

  // This method will reset the password
  onResetPassword(otp: string, newPassword: string): void {
    const { email, organizationCode } = this.loginForm.value;
    this.authService.resetPassword(email, otp, newPassword, organizationCode).subscribe(
      (response) => {
        // Log the response for debugging purposes
        console.log('Reset Password Response:', response);

        if (response === 'User password reset successfully.') {
          alert('Password reset successful.');
          this.displayForgotPasswordDialog = false;  // Close the dialog
        } else {
          alert('Failed to reset password. Please try again.');
        }
      },
      (error) => {
        console.error('Reset password error:', error);
        alert('Failed to reset password. Please try again.');
      }
    );
  }

}