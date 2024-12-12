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
import { EmployeeService } from '../../../services/employee.service';
import { LeaveMasterService } from '../../../services/leave-master.service';
import { HolidayService } from '../../../services/holiday.service';
import { PermissionService } from '../../../services/permission.service';

@Component({
  selector: 'app-leave-adjustment',
  templateUrl: './leave-adjustment.component.html',
  styleUrl: './leave-adjustment.component.scss',
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
export class LeaveAdjustmentComponent {
  voucherDate: Date | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;

  canAddLeaveAdjus: boolean = false;
  constructor(private employeeService: EmployeeService, private LeaveMasterService: LeaveMasterService,
    private http: HttpClient,
    private messageService: MessageService,
    private holidayService: HolidayService,
    private permissionService: PermissionService,
  ) {

  }


  LeaveRequestDate: string = '';
  ngOnInit() {
    const today = new Date();
    this.LeaveRequestDate = today.toISOString().split('T')[0];
    this.holidayService.refresh$.subscribe(() => {
      this.getLeaveAdjustmentNextSno(); // Reload the data when notified
    });


    this.loadEmployees();
    this.getLeaveAdjustmentNextSno();

    this.canAddLeaveAdjus = this.permissionService.hasPermission('LeaveAdjustmentComponent', 'LeaveAdjustmentComponentAdd');

  }
  leaveCodes: { label: string; value: number }[] = [];
  accuredCodes: any[] = [
    { label: 'Accrued', value: 'accrued' },
    { label: 'Deduct', value: 'deduct' }
  ];
  selectedaccuredCode: string | null = null;
  days: number = 0;
  selectedEmployee: number | null = null;

  isSubmitting = false;
  selectedLeaveCode: string | null = null;
  voucherNo: number | null = null;
  reason: string = '';
  remark: string = '';
  remarkFinance: string = '';
  employees: { label: string; value: string | number }[] = [];

  getLeaveAdjustmentNextSno(): void {
    this.LeaveMasterService.getLeaveAdjustmentNextSno().subscribe({
      next: (response) => {
        this.voucherNo = response.nextSno;
        console.log(this.voucherNo);// Assign nextSno to voucherNo
      },
      error: (error) => {
        console.error('Error fetching nextSno:', error);
        this.voucherNo = null; // Handle errors gracefully
      }
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
      await this.loadLeaveCodes(selectedEmployeeCode);
    } catch (error) {
      console.error('Error fetching employee details or leave codes:', error);
    }
  }
  async loadLeaveCodes(empCode: number): Promise<void> {
    try {
      const leaveData = await this.LeaveMasterService.getLeaveTypesForEmployee(empCode).toPromise();
      console.log(leaveData);

      // Check if leaveData is an array
      if (Array.isArray(leaveData)) {
        // Transform the API data to dropdown format
        this.leaveCodes = leaveData.map((leave) => ({
          label: leave.leaveType, // Display text
          value: leave.empLeavesCode, // Actual leave code value
        }));
        console.log('Leave Codes:', this.leaveCodes);
      } else {
        this.leaveCodes = []; // In case leaveData is undefined or not an array
        console.error('Invalid or undefined leave data received');
      }
    } catch (error) {
      console.error('Error loading leave codes:', error);
      this.leaveCodes = []; // Clear the dropdown on error
    }
  }

  saveLeaveAdjustment(): void {
    if (!this.canAddLeaveAdjus) {
      console.error('You do not have permission to add Leave Adjustment.');
      return;
    }
    this.isSubmitting = true;
    if (!this.selectedEmployee || !this.selectedLeaveCode || !this.reason) {
      alert('Please fill in all required fields.');
      this.isSubmitting = false;
      return;
    }

    // Prepare the data structure for the API request
    const leaveAdjustmentData = {
      sno: this.voucherNo,
      empCode: this.selectedEmployee,
      leaveCode: this.selectedLeaveCode,
      leaveAdjustDate: this.LeaveRequestDate,
      leaveReason: this.reason,
      leaveDays: this.days,
      leaveAccuredDeduct: this.selectedaccuredCode,
    };

    console.log(leaveAdjustmentData);

    // Call the service method to save leave adjustment
    this.LeaveMasterService.saveLeaveAdjustment(leaveAdjustmentData).subscribe({
      next: (response) => {
        // Show success toast message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Leave adjustment saved successfully!',
        });
        this.isSubmitting = false;
        console.log('Leave adjustment saved:', response);
        this.holidayService.triggerRefresh();

        // Reset form fields after successful save
        this.resetLeaveAdjustmentForm();
      },
      error: (error) => {
        // Show error toast message
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save leave adjustment.',
        });
        this.isSubmitting = false;
        console.error('Error saving leave adjustment:', error);
      }
    });
  }


  // Method to reset the fields
  resetLeaveAdjustmentForm() {

    this.selectedEmployee = null;
    this.selectedLeaveCode = null;
    this.joiningDate = '';
    this.confirmationDate = '';
    this.department = '';
    this.designation = '';


    this.reason = '';
    this.days = 0;
    this.selectedaccuredCode = null;
  }
  resetFields() {
    this.selectedEmployee = null;
    this.voucherNo = null;
    this.joiningDate = '';
    this.confirmationDate = '';
    this.department = '';
    this.designation = '';
    this.selectedLeaveCode = '';

    this.days = 0;
    this.reason = '';
  }

}