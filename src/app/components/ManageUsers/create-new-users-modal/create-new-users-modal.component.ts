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
import { PermissionService } from '../../../services/permission.service';





@Component({
  selector: 'app-create-new-users-modal',
  templateUrl: './create-new-users-modal.component.html',
  styleUrl: './create-new-users-modal.component.scss',
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
export class CreateNewUsersModalComponent {
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
  permissionId: number = 0;

  canViewWeekOff: boolean = false;
  canAddNewUser: boolean = false;
  organizationList: any[] = []; // List to hold organization options
  selectedAllowedCompany: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private userService: UserServiceService,
    private holidayService: HolidayService,
    private permissionService: PermissionService,
  ) {

  }

  showDialog() {
    this.visible = true;
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
    this.canAddNewUser = this.permissionService.hasPermission(
      'ManageUsersPermission',
      'ManageUsersPermissionAdd'
    );
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
  onEmployeeNameChange() {
    if (this.selectedEmployeeName) {
      // Fetch employee details based on the empCode (selectedEmployeeName)
      this.employeeService.getEmployeeEmergencyContactByCode(this.selectedEmployeeName).subscribe(
        (contactDetails) => {
          // Assuming 'empEmergencyEmail' and 'empEmergencyPhoneNo' are part of the contactDetails
          this.emailId = contactDetails.email || ''; // Set the email ID
          this.mobileNumber = contactDetails.mobile || ''; // Set the mobile number
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch employee details.' });
        }
      );
    }
  }

  isSubmitting = false;
  saveUserData(event: Event) {
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
    const formattedTime = this.formatTime(this.fromTime);
    const formattedtotime = this.formatTime(this.toTime);

    // Prepare the data to be sent to the backend
    const userData = {
      sno: 0,
      password: this.password,
      empCode: this.selectedEmployeeName,
      gender: this.selectedGender,  // Example, use your variable here
      emailId: this.emailId,
      mobileNumber: parseInt(this.mobileNumber),
      otprequired: this.otpRequired,
      timeRestriction: this.timeRestriction,
      fromTime: formattedTime,
      toTime: formattedtotime,
      allowedWeekDays: this.selectedWeekdaysText, // Use the updated text
      reportingTo: this.selectedReportingTo,  // Use reporting to employee code
      rolePermissionId: selectedRolePermissionId,
      allowCompany: this.selectedAllowedCompany // Default permissionId, modify as necessary
    };

    console.log('user data', userData);

    // Call the save method from the service
    this.userService.saveUserData(userData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully!' });
        this.isSubmitting = false;
        this.password = '';
        this.confirmPassword = '';
        this.selectedEmployeeName = null; // Or an appropriate default value
        this.selectedGender = '';
        this.emailId = '';
        this.mobileNumber = '';
        this.otpRequired = false;
        this.timeRestriction = false;
        this.fromTime = ''; // Or a default time value
        this.toTime = ''; // Or a default time value
        this.selectedWeekdaysText = '';
        this.selectedReportingTo = null;
        this.holidayService.triggerRefresh();
        this.hideDialog();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user.' });
        this.isSubmitting = false;
      }
    );
  }

  // Helper function to convert time string to object format

  formatTime(time: string): string {
    if (time) {
      // Append ':00' to convert it into hh:mm:ss format
      return `${time}:00`;
    }
    return '';
  }

}