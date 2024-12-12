import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectItem } from 'primeng/api'; // For dropdown options
import { FileUpload } from 'primeng/fileupload'; // If using file upload
import { FormsModule } from '@angular/forms';  // To support ngModel binding
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
// import { ApiService } from '../../api.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
// import { EmployeeData } from './employe-detail-modal';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Card, CardModule } from 'primeng/card';
import { EmployeeService } from '../../services/employee.service';
import { LeaveMasterService } from '../../services/leave-master.service';
import { HolidayService } from '../../services/holiday.service';

@Component({
  selector: 'app-empremark',
  templateUrl: './empremark.component.html',
  styleUrl: './empremark.component.scss',
  standalone: true,
  imports: [
    DialogModule, ButtonModule, FormsModule,
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    PanelModule,
    CheckboxModule,
    TableModule,
    InputNumberModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    CardModule
  ],
})

export class EmpremarkComponent {

  fromDate: Date | null = null;

  constructor(private employeeService: EmployeeService, private LeaveMasterService: LeaveMasterService,
    private http: HttpClient,
    private messageService: MessageService,
    private holidayService: HolidayService,
  ) {

  }
  seriousnessOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'High', value: 'High' }
  ];

  selectedSeriousness: string | null = null;
  positiveNegativeOptions = [
    { label: 'Positive', value: 'Positive' },
    { label: 'Negative', value: 'Negative' }
  ];

  selectedPositiveNegative: string | null = null;


  ngOnInit() {


    this.loadEmployees();
    this.getEmpReviewRemarkNextSno();
    this.holidayService.refresh$.subscribe(() => {
      this.getEmpReviewRemarkNextSno(); // Reload the data when notified
    });


  }

  selectedaccuredCode: string | null = null;
  days: number = 0;
  selectedEmployee: number | null = null;


  selectedLeaveCode: string | null = null;
  voucherNo: number | null = null;
  reason: string = '';

  employees: { label: string; value: string | number }[] = [];
  getEmpReviewRemarkNextSno(): void {
    this.LeaveMasterService.getEmpReviewRemarkNextSerialNumber().subscribe({
      next: (response) => {
        console.log(response);

        this.voucherNo = typeof response === 'number' ? response : response.nextSerialNumber;
        console.log('EmpReviewRemark Serial Number:', this.voucherNo);
      },
      error: (error) => {
        console.error('Error fetching EmpReviewRemark next serial number:', error);
      },
    });
  }





  async loadEmployees() {
    try {
      const data = await this.employeeService.getEmployeeData().toPromise(); // Using `toPromise()` to convert the Observable to a Promise.
      console.log("employee service data", data);  // Log the raw data for debugging

      if (data && Array.isArray(data)) {
        // Map the employee data to the correct format for the dropdown
        this.employees = data.map((employee: any) => {
          // Directly use the top-level properties like 'name' and 'code'
          const label = employee.name || 'No Name';
          const value = employee.code || 'No Code';

          // Log the employee mapping for debugging
          console.log(`Employee mapped: ${label}, ${value}`);

          return {
            label: label,
            value: value
          };
        });

        console.log('Employees for dropdown:', this.employees);  // Final log of the employee data for dropdown
      } else {
        // If data is not an array or is undefined, set employees to an empty array
        this.employees = [];
        console.warn('No valid employee data received');
      }
    } catch (error) {
      console.error('Error loading employee data:', error);  // Error handling
    }
  }

  joiningDate: string = '';
  confirmationDate: string = '';
  department: string = '';
  designation: string = '';
  async onEmployeeSelect(event: any) {
    const selectedEmployeeCode = event.value;
    console.log('Selected Employee Code:', selectedEmployeeCode);

    try {
      // Fetch and set employee details
      const details = await this.employeeService
        .getEmployeeDetailsByCode(selectedEmployeeCode)
        .toPromise();

      this.joiningDate = details.joiningDate || '';
      this.confirmationDate = details.confirmationDate || '';
      this.department = details.department || '';
      this.designation = details.designation || '';

      // Fetch leave codes for the selected employee

    } catch (error) {
      console.error('Error fetching employee details or leave codes:', error);
    }
  }


  saveEmpReviewRemark() {
    // Validate required fields
    if (!this.voucherNo || !this.selectedEmployee || !this.fromDate || !this.selectedSeriousness || !this.selectedPositiveNegative || !this.reason) {
      // Show error message using MessageService
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields.',
      });
      return;
    }

    // Prepare the data structure for the API request
    const empReviewRemarkData = {
      sno: this.voucherNo, // Serial number from API
      empCode: this.selectedEmployee, // Employee Code
      empReviewDate: this.fromDate, // Format as YYYY-MM-DD (ensure it's in the correct format)
      empReviewType: this.selectedPositiveNegative, // Set the review type (could be dynamic if needed)
      empReviewSeriousness: this.selectedSeriousness, // Selected seriousness from the dropdown
      empReviewDescription: this.reason, // Reason for review (you can use another field if needed)
    };

    console.log('Employee Review Remark Data:', empReviewRemarkData); // Log for debugging

    // Call the service method to send data to the API
    this.LeaveMasterService.saveEmpReviewRemark(empReviewRemarkData)
      .subscribe({
        next: (response) => {
          // Show success message
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee review remark saved successfully!',
          });
          console.log('Employee Review Remark saved:', response);
          this.holidayService.triggerRefresh();
          // Reset form fields after successful save
          this.resetEmpReviewRemarkForm();
        },
        error: (error) => {
          // Show error message
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save employee review remark.',
          });
          console.error('Error saving employee review remark:', error);
        }
      });
  }

  // Method to reset the form fields after save
  resetEmpReviewRemarkForm() {
    this.selectedEmployee = null;
    this.fromDate = null;
    this.selectedSeriousness = null;
    this.selectedPositiveNegative = null;
    this.reason = '';
    this.joiningDate = '';
    this.confirmationDate = '';
    this.department = '';
    this.designation = '';
  }




}
