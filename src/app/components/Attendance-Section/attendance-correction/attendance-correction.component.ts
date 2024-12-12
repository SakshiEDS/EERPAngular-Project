import { Component, EventEmitter, Input, input, OnInit, Output, ViewChild } from "@angular/core";
import { Table, TableModule } from "primeng/table";
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from "primeng/dialog";
import { Checkbox, CheckboxModule } from "primeng/checkbox";
import { ActivatedRoute } from "@angular/router";
import { EmployeeService } from "../../../services/employee.service";
import { HttpClient } from "@angular/common/http";
import { OvertimeserviceService } from "../../../services/overtimeservice.service";
import { MessageService } from "primeng/api";
import { PermissionService } from "../../../services/permission.service";


@Component({
  selector: 'app-attendance-correction',
  templateUrl: './attendance-correction.component.html',
  styleUrl: './attendance-correction.component.scss',
  standalone: true,
  imports: [TableModule, TagModule, ButtonModule, IconFieldModule, InputIconModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, SliderModule, ProgressBarModule,
    FormsModule, AvatarModule, ReactiveFormsModule, ToastModule, DialogModule, CheckboxModule
  ],
  providers: [MessageService]
})
export class AttendanceCorrectionComponent {

  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  isModalOpen = false;
  selectedTime: string = '';

  visible: boolean = false;
  inOutOptions = [
    { label: 'InTime', value: 'InTime' },
    { label: 'OutTime', value: 'OutTime' }
  ];

  // Variable to store selected value
  selectedInOutTime: string = '';

  canAttendanceCorrection: boolean = false;

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService, private http: HttpClient,
    private overtimeService: OvertimeserviceService, private messageService: MessageService,
    private permissionService: PermissionService,
  ) { }
  LeaveRequestDate: string = '';


  employeeNames: any[] = [];  // Array to hold employee name options
  selectedEmployee: any; // The selected employee



  ngOnInit(): void {
    this.canAttendanceCorrection = this.permissionService.hasPermission('AttendanceCorrectionComponent', 'AttendanceCorrectionComponentUpdate');
    this.selectedEmployee = null;
    this.selectedInOutTime = '';
    this.selectedTime = '';
    const today = new Date();
    this.LeaveRequestDate = today.toISOString().split('T')[0];
    console.log(this.LeaveRequestDate);
    // Fetch employee data
    this.employeeService.getAllEmployeeData().subscribe((data) => {
      // Prepare the data for the dropdown list
      this.employeeNames = data.map((emp: any) => ({
        name: emp.empName,  // The name to display in the dropdown
        code: emp.empCode   // The value that will be used when an item is selected
      }));
    });

  }
  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }
  isSubmitting = false; // Track the submission state

  submitAttendanceCorrection() {
    // Set the submitting state to true when the form is being submitted
    this.isSubmitting = true;

    console.log('Selected Employee:', this.selectedEmployee);
    console.log('Selected In/Out Type:', this.selectedInOutTime);
    console.log('Selected Time:', this.selectedTime);
    const currentDateTime = new Date().toISOString();
    const formattedTime = this.formatTime(this.selectedTime);  // Format the selected time

    // Prepare the request payload
    const payload = {
      sno: 0,
      empCode: this.selectedEmployee,
      empInOutType: this.selectedInOutTime,
      empDate: this.LeaveRequestDate,
      empTime: formattedTime,
      empCorrectByCode: 67890

      // Corrector's employee code
      // Current timestamp

    };
    console.log(payload);

    // Call the service to submit the correction
    this.overtimeService.submitAttendanceCorrection(payload).subscribe({
      next: (response) => {
        console.log('Attendance correction submitted successfully', response);

        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Attendance correction submitted successfully',
        });

        // Hide the modal dialog after success
        this.hideDialog();

        // Disable the button after successful submission
        this.isSubmitting = false;  // Disable the button on success
      },
      error: (error) => {
        console.error('Error submitting attendance correction', error);

        // Show error message
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error submitting attendance correction.',
        });

        // Do not disable the button if there's an error, reset submitting state
        this.isSubmitting = false;  // Keep the button enabled after error
      }
    });
  }



  formatTime(time: string): string {
    if (time) {
      // Append ':00' to convert it into hh:mm:ss format
      return `${time}:00`;
    }
    return '';
  }
}