import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Card, CardModule } from 'primeng/card';
import { EmployeeService } from '../../../services/employee.service';
import { LeaveMasterService } from '../../../services/leave-master.service';
import { EmployeeData } from '../../employe-detail-modal/employe-detail-modal';
import { HttpClient } from '@angular/common/http';
import { HolidayService } from '../../../services/holiday.service';
import { PermissionService } from '../../../services/permission.service';
// import { EmployeeService } from '../../../../service/employee.service';
// import { LeaveMasterService } from '../../../../service/leave-master.service';
// import Swal from 'sweetalert2';



@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrl: './leave-application.component.scss',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule,  // Make sure you have FormsModule for ngModel
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


export class LeaveApplicationComponent implements OnInit {
  voucherDate: Date | null = null;
  canAddLeaveApp: boolean = false;

  constructor(private employeeService: EmployeeService, private LeaveMasterService: LeaveMasterService,
    private http: HttpClient,
    private messageService: MessageService,
    private holidayService: HolidayService,
    private permissionService: PermissionService,
  ) {

  }

  LeaveRequestDate: string = '';

  ngOnInit() {
    this.canAddLeaveApp = this.permissionService.hasPermission('LeaveApplicationComponent', 'LeaveApplicationComponentAdd');
    const today = new Date();
    this.LeaveRequestDate = today.toISOString().split('T')[0];

    this.holidayService.refresh$.subscribe(() => {
      this.getNextSno(); // Reload the data when notified
    });
    // Format date as yyyy-MM-dd
    // this.loadEmployeeDropdown();
    this.loadEmployees();
    this.resetLeaveInOptions();
    this.getNextSno();
    this.submitted = false;

  }


  employees: { label: string; value: string | number }[] = [];
  selectedEmployee: number | null = null;

  leaveCodes: { label: string; value: number }[] = []; // For Leave Types Dropdown
  selectedLeaveCode: number | null = null;

  voucherNo: number | null = null;

  managercode: number | null = null;
  reason: string = '';
  remark: string = '';
  remarkFinance: string = '';


  selectedLeaveIn: string | null = null;

  leaveIn = [
    { label: 'First Half', value: 'FirstHalf' },
    { label: 'Second Half', value: 'SecondHalf' },
    { label: 'Full Day', value: 'FullDay' },
    { label: 'N/A', value: 'NA' }, // Default option for non-same-day leaves
  ];

  fromDate: string = '';
  toDate: string = '';

  // selectedLeaveIn: string = '';
  dropdownDisabled: boolean = false;
  days: number = 0;

  submitted = false;


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


  onDateChange() {
    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);

      if (from.getTime() === to.getTime()) {
        // Same day: Enable dropdown for "First Half," "Second Half," and "Full Day"
        this.dropdownDisabled = false;
        this.leaveIn = [
          { label: 'First Half', value: 'FirstHalf' },
          { label: 'Second Half', value: 'SecondHalf' },
          { label: 'Full Day', value: 'FullDay' }
        ];
        this.selectedLeaveIn = null; // No default selection
        this.days = 1; // Default full-day leave
      } else if (to > from) {
        // Multiple days: Disable dropdown and set "Full Day"
        this.dropdownDisabled = true;
        this.leaveIn = [{ label: 'Full Day', value: 'FullDay' }];
        this.selectedLeaveIn = 'FullDay'; // Automatically select "Full Day"
        const timeDiff = Math.abs((to.getTime() - from.getTime()) + 1);
        this.days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Calculate total days
      } else {
        // Invalid case: Reset dropdown and days
        this.resetLeaveInOptions();
        this.days = 0;
      }
    } else {
      // Clear the fields if dates are not selected
      this.resetLeaveInOptions();
      this.days = 0;
    }
  }


  onLeaveInChange() {
    if (this.selectedLeaveIn === 'FirstHalf' || this.selectedLeaveIn === 'SecondHalf') {
      this.days = 0.5; // Half-day leave
    } else if (this.selectedLeaveIn === 'FullDay') {
      this.days = 1; // Full-day leave for the same date
    }
  }

  resetLeaveInOptions() {
    this.leaveIn = [{ label: 'N/A', value: 'NA' }];
    this.selectedLeaveIn = null;
    this.dropdownDisabled = true;
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
  managerName: string = ''; // New field to store manager's name

  joiningDate: string = '';
  confirmationDate: string = '';
  department: string = '';
  designation: string = '';
  async onEmployeeSelect(event: any) {
    const selectedEmployeeCode = event.value;
    console.log('Selected Employee Code:', selectedEmployeeCode);

    try {
      // Fetch selected employee details
      const employeeDetails = await this.employeeService
        .getEmployeeDetailsByCode(selectedEmployeeCode)
        .toPromise();

      if (!employeeDetails) {
        console.warn('No employee details found for code:', selectedEmployeeCode);
        this.managerName = 'N/A';
        return;
      }

      // Assign fetched employee details
      this.joiningDate = employeeDetails.joiningDate || '';
      this.confirmationDate = employeeDetails.confirmationDate || '';
      this.department = employeeDetails.department || '';
      this.designation = employeeDetails.designation || '';
      await this.loadLeaveCodes(selectedEmployeeCode);
      // Fetch all employee data
      const allEmployees = await this.employeeService.getAllEmployeeData().toPromise();

      if (!allEmployees || allEmployees.length === 0) {
        console.warn('No employee data available.');
        this.managerName = 'N/A';
        return;
      }

      // Find manager by matching empCode from reportingTo
      const manager = allEmployees.find((emp: any) => emp.empCode === employeeDetails.reportingTo);
      this.managercode = employeeDetails.reportingTo;


      if (manager) {
        this.managerName = manager.empName; // Display the manager's name
      } else {
        console.warn('No manager found for reportingTo:', employeeDetails.reportingTo);
        this.managerName = 'N/A';
      }
    } catch (error) {
      console.error('Error in onEmployeeSelect:', error);
      this.managerName = 'N/A'; // Fallback for errors
    }
  }


  getNextSno(): void {
    this.LeaveMasterService.getNextSno().subscribe({
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
  isSubmitting = false;
  submitLeaveApplication(): void {
    if (!this.canAddLeaveApp) {
      console.error('You do not have permission to add Leave Application.');
      return;
    }
    this.submitted = true;
    this.isSubmitting = true;
    if (!this.selectedEmployee || !this.selectedLeaveCode || !this.reason) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill in all required fields.' });
      this.isSubmitting = false;
      return;
    }

    // Find the leave code corresponding to the selected leave type
    const leaveCode = this.leaveCodes.find(leave => leave.value === this.selectedLeaveCode)?.value;

    if (!leaveCode) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Leave code not found for the selected leave type.' });
      return;
    }

    const payload = {
      sno: this.voucherNo,
      empCode: this.selectedEmployee,
      managerCode: this.managercode, // Use the manager's name here
      leaveCode: leaveCode,
      leaveRequestCode: null,
      leaveApplyDate: this.LeaveRequestDate,
      leaveToDate: this.toDate,
      leaveFromDate: this.fromDate,
      leaveInType: this.selectedLeaveIn,
      leaveReason: this.reason,
      leaveRemark: null,
      leaveStatus: null,
      leaveDays: this.days,
      leaveActionDate: null,
    };

    console.log(payload);

    // Call the service method to submit the leave application
    this.LeaveMasterService.submitLeaveApplication(payload).subscribe({
      next: (response) => {
        console.log('Leave application submitted successfully:', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leave application submitted successfully!' });
        this.isSubmitting = false;
        this.holidayService.triggerRefresh();

        this.resetFormFields(); // Reset fields after successful submission

      },
      error: (error) => {
        console.error('Error submitting leave application:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit leave application.' });
        this.isSubmitting = false;
      }
    });
  }
  cancelLeaveApplication() {
    // Reset all form fields to their initial state
    this.resetFormFields();

  }

  resetFormFields() {
    this.selectedEmployee = null;
    this.selectedLeaveCode = null;
    this.selectedLeaveIn = null;
    this.reason = '';
    this.fromDate = '';
    this.toDate = '';
    this.days = 0;
    this.LeaveRequestDate = this.LeaveRequestDate; // Optionally reset the date if necessary
    this.joiningDate = '';
    this.confirmationDate = '';
    this.department = '';
    this.designation = '';
    this.voucherNo = 0;
    this.managerName = '';

  }


}