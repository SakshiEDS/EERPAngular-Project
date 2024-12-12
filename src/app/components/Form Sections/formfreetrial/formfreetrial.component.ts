import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { HttpClient } from '@angular/common/http';
import { OrganisationService } from '../../../services/organisation.service';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-formfreetrial',
  templateUrl: './formfreetrial.component.html',
  styleUrl: './formfreetrial.component.scss',
  standalone: true,
  imports: [
    InputTextModule,   // Input text fields
    DropdownModule,    // Dropdown fields
    ButtonModule,      // Button
    CalendarModule,    // Date/Time Picker
    CheckboxModule,
    DropdownModule,
    ReactiveFormsModule,
    PasswordModule,
    ToastModule,
    CommonModule


    // Checkbox
  ],
  providers: [MessageService],


})
export class FormfreetrialComponent implements OnInit {
  signUpForm!: FormGroup;

  // Default dropdown options
  titleOptions = [
    { label: 'Mr.', value: 'mr' },
    { label: 'Mrs.', value: 'mrs' },
    { label: 'Ms.', value: 'ms' }
  ];

  firmTypes = [
    { label: 'Limited/Pvt_Ltd/LLP', value: 'Limited/Pvt_Ltd/LLP' },
    { label: 'Partnership/Proprietorship', value: 'Partnership/Proprietorship' },
    { label: 'Other', value: 'other' }
  ];

  businessTypes = [
    { label: 'Books_Stationary', value: 'books_stationary' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Garment_Store', value: 'garment_store' },
    { label: 'Food_Restaurant', value: 'food_restaurant' },
    { label: 'Hotels', value: 'hotels' },
    { label: 'Jobwork_Repair', value: 'jobwork_repair' },
    { label: 'Mobile_Store', value: 'mobile_store' },
    { label: 'Pharmacy', value: 'pharmacy' },
    { label: 'Professional_Services', value: 'professional_services' },
    { label: 'Security_Services', value: 'security_services' },
    { label: 'Tour_Travel', value: 'tour_travel' },
    { label: 'Trading_Business', value: 'trading_business' },
    { label: 'Grocery_Store', value: 'grocery_store' },
    { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Retail_Counter', value: 'retail_counter' },
    { label: 'Retail_Chain_Store', value: 'retail_chain_store' },
    { label: 'Automobile', value: 'automobile' },
    { label: 'Others', value: 'others' }
  ];

  timeSlots = [
    { label: '09:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' }
  ];

  otpSent: boolean = false;
  otp: string = '';
  contactTypes: any[] = [];
  isVerifyingOtp: boolean = false;
  isResendingOtp: boolean = false;
  otpForm!: FormGroup;
  // To store country options for contactType dropdown

  constructor(private fb: FormBuilder, private http: HttpClient,
    private formService: OrganisationService,
    private messageService: MessageService,
    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      organizationName: ['', Validators.required],

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      organizationMail: ['', [Validators.required, Validators.email]],
      organizationMobileNo: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^[A-Za-z][A-Za-z0-9@#$%^&+=]{7,}$')  // Password pattern validation
      ]],
      confirmPassword: ['', Validators.required],
      organizationType: ['', Validators.required],
      organizationBusinessType: ['', Validators.required],
      organizationPartnerCode: [''],
      organizationCountyCode: ['', Validators.required],
      organizationContactPerson: [''], // Hidden concatenated contact person
      organizationPassword: [''], // Hidden password field
    });
    this.otpForm = this.fb.group({
      otp: ['', Validators.required] // Form control for OTP input
    });


    this.signUpForm.valueChanges.subscribe((formValues) => {
      const { firstName, lastName, password, confirmPassword } = formValues;
      const contactPerson = `${firstName} ${lastName}`.trim();
      const finalPassword = password === confirmPassword ? password : '';
      console.log(contactPerson);
      console.log(finalPassword);

      this.signUpForm.patchValue(
        {
          organizationContactPerson: contactPerson,
          organizationPassword: finalPassword,
        },
        { emitEvent: false }
      );
    });



    // Fetch country data using the service
    this.formService.getCountryCodes().subscribe((data) => {
      console.log(data);  // Check the data structure
      this.contactTypes = data.map((country) => ({
        label: `${country.code} (${country.dial_code}) `,
        value: country.dial_code,
      }));
    });

  }
  isSubmitting = false;

  onSubmit(): void {
    this.isSubmitting = true;
    if (this.signUpForm.value.password !== this.signUpForm.value.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Password Mismatch',
        detail: 'Password and confirm password do not match.',
      });
      this.isSubmitting = false;
      return; // Stop further processing if passwords don't match
    }
    if (this.signUpForm.valid) {
      const phoneNumber = this.signUpForm.value.organizationMobileNo;
      const email = this.signUpForm.value.organizationMail;

      // Check if phone number exists
      this.formService.checkPhoneNumberExists(phoneNumber).subscribe((phoneExists) => {
        if (phoneExists) {
          this.messageService.add({
            severity: 'error',
            summary: 'Phone Number Exists',
            detail: 'This phone number already exists.',
          });
          this.isSubmitting = false;
          return; // Stop form submission if phone number exists
        }

        // Check if email exists
        this.formService.checkEmailExists(email).subscribe((emailExists) => {
          if (emailExists) {
            this.messageService.add({
              severity: 'error',
              summary: 'Email Exists',
              detail: 'This email ID already exists.',
            });
            this.isSubmitting = false;
            return; // Stop form submission if email exists
          }

          // Continue with form submission if phone number and email are valid
          const payload = {
            organizationName: this.signUpForm.value.organizationName,
            organizationContactPerson: this.signUpForm.value.organizationContactPerson,
            organizationMail: this.signUpForm.value.organizationMail,
            organizationMobileNo: this.signUpForm.value.organizationMobileNo,
            organizationPassword: this.signUpForm.value.organizationPassword,
            organizationType: this.signUpForm.value.organizationType,
            organizationBusinessType: this.signUpForm.value.organizationBusinessType,
            organizationPartnerCode: this.signUpForm.value.organizationPartnerCode || 0, // Default to 0 if empty
            organizationCountyCode: this.signUpForm.value.organizationCountyCode?.value || '', // Extract value if dropdown
          };

          this.formService.submitForm(payload).subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Form Submitted',
                detail: 'Form submitted successfully!',
              });
              this.isSubmitting = false;

              // Reset the form fields after successful submission
              // this.signUpForm.reset();
              this.signUpForm.disable();  // Disable all fields after submission
              this.otpSent = true;


              // Optionally, you can reset specific fields if you need to retain certain values
              // For example, if you want to keep 'sno' value, you can do:
              // this.signUpForm.patchValue({ sno: response.nextSerialNumber });

            },
            (error) => {
              // Handle server-side errors gracefully by showing a message to the user
              this.messageService.add({
                severity: 'error',
                summary: 'Server Issue',
                detail: 'There seems to be an issue with the server. Please try again later.',
              });
              this.isSubmitting = false;
              console.error('Form submission failed', error);
            }
          );
        });
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Form',
        detail: 'Please fill all required fields.',
      });
      this.isSubmitting = false;
    }
  }


  verifyOtp(): void {
    this.isSubmitting = true;
    const otp = this.otpForm.value.otp;
    const email = this.signUpForm.value.organizationMail;

    if (!otp || !email) {
      this.messageService.add({
        severity: 'error',
        summary: 'OTP Error',
        detail: 'Please enter a valid OTP.'
      });
      this.isSubmitting = false;
      return;
    }

    const payload = { email, otp };

    this.formService.verifyOtp(payload).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Verified',
          detail: 'OTP verified successfully!'
        });
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'OTP Verification Failed',
          detail: 'Failed to verify OTP. Please try again.'
        });
        this.isSubmitting = false;
        console.error('OTP verification failed', error);
      }
    );
  }

  resendOtp(): void {
    this.isSubmitting = true;
    const email = this.signUpForm.value.organizationMail;

    if (!email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Email Error',
        detail: 'Email is required to resend OTP.'
      });
      this.isSubmitting = false;
      return;
    }

    this.formService.resendOtp(email).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'OTP Resent',
          detail: 'OTP has been resent to your email.'
        });
        this.isSubmitting = false;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Resend OTP Failed',
          detail: 'Failed to resend OTP. Please try again later.'
        });
        this.isSubmitting = false;
        console.error('Resend OTP failed', error);
      }
    );
  }


}
