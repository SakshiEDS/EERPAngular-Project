import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
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

import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EmployeeService } from '../../../services/employee.service';
import { UserServiceService } from '../../../services/user-service.service';
import { HolidayService } from '../../../services/holiday.service';
import { RolePermissionComponent } from "../../Permission-Section/role-permission/role-permission.component";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, // Make sure you have FormsModule for ngModel
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
    ToastModule, RolePermissionComponent],
})

export class UserEditComponent {
  @ViewChild('rolePermissionDialog') rolePermissionDialog!: RolePermissionComponent;
  selectedReportingTo: any;  // For the Reporting To dropdown
  selectedEmployeeName: any;
  visible = false;
  weekdaysDialogVisible = false;
  selectedWeekdays: string[] = [];
  selectAll = false;
  employeeNames: any[] = [];  // Array to hold employee name options
  selectedEmployee: any;
  genderOptions: { label: string, value: string }[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];
  selectedGender: string = '';
  selectedAllowedCompany: any;
  organizationList: any[] = [];
  weekdaysList = [
    { label: 'Monday', selected: false },
    { label: 'Tuesday', selected: false },
    { label: 'Wednesday', selected: false },
    { label: 'Thursday', selected: false },
    { label: 'Friday', selected: false },
    { label: 'Saturday', selected: false },
    { label: 'Sunday', selected: false },
  ];
  password: string = '';
  confirmPassword: string = '';
  emailId: string = '';
  mobileNumber: string = '';
  otpRequired: boolean = false;
  timeRestriction: boolean = false;
  fromTime: string = '';  // Default time in hh:mm:ss format
  toTime: string = '';    // Default time
  reportingTo: any;
  allowCompany: string = '';
  selectedWeekdaysText: string = '';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private userservice: UserServiceService,
    private holidayService: HolidayService,
  ) {

  }
  @Input() employeeSno: number = 0;
  employeeData: any;
  showDialog(empCode: string) {
    this.visible = false;  // Ensure modal is not visible initially

    this.userservice.getEmployeeDetailsByCode(empCode).subscribe(
      (data) => {
        console.log(data);
        this.employeeData = data;
        this.selectedEmployeeName = data.empCode;
        this.password = data.password;
        this.confirmPassword = data.password;
        this.otpRequired = data.otprequired;
        this.timeRestriction = data.timeRestriction;
        this.emailId = data.emailId;
        this.mobileNumber = data.mobileNumber;
        this.selectedGender = data.gender;
        this.selectedReportingTo = data.reportingTo;
        this.fromTime = data.fromTime;
        this.toTime = data.toTime;
        this.selectedWeekdaysText = data.allowedWeekDays;
        this.selectedAllowedCompany = data.allowCompany;

        // Set the selectedAllowedCompany to the organization name based on organizationCode
        console.log('organizationList:', this.organizationList);
        console.log('selectedAllowedCompany:', this.selectedAllowedCompany);

        // Wait for the organizationList to be populated
        if (this.organizationList && this.selectedAllowedCompany) {
          const selectedOrg = this.organizationList.find(org => org.organizationCode === this.selectedAllowedCompany);
          console.log('selectedOrg:', selectedOrg);

          if (selectedOrg) {
            this.selectedAllowedCompany = selectedOrg.organizationName;  // Set the organization name
          } else {
            console.log('No organization found for the code:', this.selectedAllowedCompany);
          }
        }

        this.rolePermissionDialog.selectedRolePermission = data.rolePermissionId;
        this.visible = true;  // Open the modal only after data is fetched
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );

  }


  hideDialog() {
    this.visible = false;
  }

  showWeekdaysDialog() {
    this.weekdaysDialogVisible = true;
  }

  updateWeekdays(day: string, isSelected: boolean) {
    if (isSelected) {
      this.selectedWeekdays.push(day);
    } else {
      this.selectedWeekdays = this.selectedWeekdays.filter((d) => d !== day);
    }
  }

  toggleWeekdaysDialog() {
    this.weekdaysDialogVisible = true;
  }

  // Updates selected weekdays when a checkbox is toggled
  // Updates the 'Select All' checkbox state based on individual checkboxes
  toggleWeekday(day: any) {
    if (day.selected) {
      // Add to the selectedWeekdays array when checkbox is checked
      if (!this.selectedWeekdays.includes(day.label)) {
        this.selectedWeekdays.push(day.label);
      }
    } else {
      // Remove from the selectedWeekdays array when checkbox is unchecked
      const index = this.selectedWeekdays.indexOf(day.label);
      if (index > -1) {
        this.selectedWeekdays.splice(index, 1);
      }
    }

    // Update the selectedWeekdaysText
    this.updateSelectedWeekdaysText();

    // Check if all weekdays are selected, update 'Select All' state
    this.updateSelectAllState();
  }

  // When 'Select All' checkbox is toggled
  toggleSelectAll() {
    if (this.selectAll) {
      // If 'Select All' is checked, select all weekdays
      this.selectedWeekdays = [...this.weekdaysList.map(day => day.label)];
      this.weekdaysList.forEach(day => day.selected = true);
    } else {
      // If 'Select All' is unchecked, unselect all weekdays
      this.selectedWeekdays = [];
      this.weekdaysList.forEach(day => day.selected = false);
    }

    // Update the selectedWeekdaysText
    this.updateSelectedWeekdaysText();
  }

  // Helper function to update the 'selectedWeekdaysText'
  updateSelectedWeekdaysText() {
    this.selectedWeekdaysText = this.selectedWeekdays.join(', ');
  }
  updateSelectAllState() {
    const allSelected = this.weekdaysList.every(day => day.selected);
    this.selectAll = allSelected;  // Set 'Select All' to true if all checkboxes are selected
  }
  ngOnInit() {
    this.http.get<any[]>('http://13.233.79.234:8080/api/OrganizationInfo').subscribe(
      (data) => {
        // Map the data to the format required by the dropdown
        this.organizationList = data.map(org => ({
          organizationName: org.organizationName, // Displayed in the dropdown
          organizationCode: org.organizationCode // Value sent to the backend
        }));
      },
      (error) => {
        console.error('Error fetching organization data:', error);
      }
    );
    // Fetch employee data
    this.employeeService.getAllEmployeeData().subscribe((data) => {
      this.employeeNames = data.map((emp: any) => ({
        name: emp.empName, // The name to display in the dropdown
        code: emp.empCode  // The value that will be used when an item is selected
      }));
    });
  }



  // Helper function to convert time string to object format

  formatTime(time: string): string {
    if (time && !time.includes(':')) {
      // Append ':00' to the time string if it doesn't already include the colon
      return `${time}:00`;
    } else if (time && time.split(':').length === 2) {
      // If the time already includes hours and minutes, append ':00' for seconds
      return `${time}:00`;
    }
    return time; // If already in hh:mm:ss format, return it as is
  }

  isSubmitting = false;
  updateUserData(event: Event) {
    event.preventDefault();
    this.isSubmitting = true;
    // Password validation
    if (!this.selectedEmployeeName) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Employee Name is required!' });
      this.isSubmitting = false;
      return;
    }

    if (!this.password || !this.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Password and Confirm Password are required!' });
      this.isSubmitting = false;
      return;
    }

    // Validate if passwords match
    if (this.password !== this.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match!' });
      this.isSubmitting = false;
      return;
    }

    // Validate emailId format (simple regex for email validation)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (this.emailId && !emailRegex.test(this.emailId)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email format!' });
      this.isSubmitting = false;
      return;
    }

    const selectedRolePermissionId = this.rolePermissionDialog.selectedRolePermission;
    // Format time fields to ensure they are in hh:mm:ss format
    const formattedFromTime = this.formatTime(this.fromTime);
    const formattedToTime = this.formatTime(this.toTime);

    // Prepare the data to be sent to the backend
    const userData = {
      sno: this.employeeData.sno,  // Use the existing sno from employeeData
      password: this.password,
      empCode: this.selectedEmployeeName,
      gender: this.selectedGender,
      emailId: this.emailId,
      mobileNumber: parseInt(this.mobileNumber),
      otprequired: this.otpRequired,
      timeRestriction: this.timeRestriction,
      fromTime: formattedFromTime, // Use the formatted value
      toTime: formattedToTime,     // Use the formatted value
      allowedWeekDays: this.selectedWeekdaysText, // Use the updated text
      reportingTo: this.selectedReportingTo,
      allowCompany: this.selectedAllowedCompany,  // Use reporting to employee code
      rolePermissionId: selectedRolePermissionId  // Default permissionId, modify as necessary
    };

    console.log('user data to update (before formatting)', userData);

    // Call the update method from the service
    this.userservice.updateUserData(this.selectedEmployeeName, userData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully!' });
        this.isSubmitting = false;
        this.holidayService.triggerRefresh();
        this.hideDialog();  // Close the modal after successful update
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user.' });
        this.isSubmitting = false;
      }
    );
  }


}
