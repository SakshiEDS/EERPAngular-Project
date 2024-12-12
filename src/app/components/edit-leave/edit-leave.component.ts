import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule, Validators } from '@angular/forms';
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
import { LeaveMasterService } from '../../services/leave-master.service';
// import { EmployeeData } from '../../employe-detail-modal/employe-detail-modal';
// import { LeaveMasterService } from '../../../services/leave-master.service';
import Swal from 'sweetalert2';
import { HolidayService } from '../../services/holiday.service';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-edit-leave',
  templateUrl: './edit-leave.component.html',
  styleUrl: './edit-leave.component.scss',
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
  ],
  providers: [MessageService]
})
export class EditLeaveComponent {
  leaveForm!: FormGroup;
  visible = false;

  selectedLeaveType: string | null = null;
  leaveTypes = [
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Medical Leave', value: 'medical' },
    { label: 'Casual Leave', value: 'casual' },
    { label: 'Earned Leave', value: 'earned' },
    { label: 'Unpaid Leave', value: 'unpaid' },
    { label: 'Others', value: 'Other' },
  ];

  selectedTransableType: string | null = null;

  TransferableOption = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  selectedCashbableType: string | null = null;
  CashableOption = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];



  SelectApplicableType: string | null = null;
  applicableOption = [
    { label: 'YearlyFlat', value: 'YearlyFlat' },
    { label: 'MonthlyFlat', value: 'MonthlyFlat' },
  ];
  employees: any[] = [];
  selectedEmployee: any;


  // @Input() visible: boolean = false;  

  closeModal() {
    this.visible = false;
  }

  canDeleteLeave: boolean = false;
  canUpdateLeave: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private leaveService: LeaveMasterService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private holidayService: HolidayService,
    private permissionService: PermissionService,
  ) {
    this.leaveForm = this.fb.group({
      leaveDescription: ['', Validators.required],
      sno: [''], // Only numeric input for sno
      leaveType: ['', Validators.required],
      leaveApplicable: ['', Validators.required],
      leaveCount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Only numeric input for leaveCount
      leaveTransferable: ['', Validators.required],
      leaveCashable: ['', Validators.required],
      leaveAction: [false],
    });
    this.leaveForm.markAllAsTouched();
  }

  showDialog() {
    this.visible = true;
    this.leaveForm.markAllAsTouched();
  }

  hideDialog() {
    this.visible = false;
  }

  loadLeaves(): void {
    this.leaveService.getLeaves().subscribe(
      (data) => {
        this.employees = data; // Assign API data to the table
      },
      (error) => {
        console.error('Error fetching leave data', error);
      }
    );
  }
  editEmployee(employee: any) {
    this.leaveForm.markAllAsTouched();
    console.log('Editing employee:', employee); // Debug log
    this.visible = true; // Show the dialog
    this.leaveForm.patchValue(employee);
    this.selectedEmployee = employee; // Prefill the form with employee data
  }

  isSubmitting = false;
  updateEmployee(event: Event): void {
    if (!this.canUpdateLeave) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to update leave.'
      });
      return;
    }

    event.preventDefault();
    this.isSubmitting = true;

    // Check if the form is valid
    if (this.leaveForm.invalid) {
      // Mark all fields as touched to trigger validation feedback
      this.leaveForm.markAllAsTouched();

      // Trigger validation feedback (You can show a toast or alert)
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly.',
        life: 3000,
      });
      this.isSubmitting = false;
      return; // Prevent form submission if invalid
    }

    const sno = this.leaveForm.value.sno;
    const updatedData = this.leaveForm.value;

    console.log('Updated data:', updatedData);

    this.leaveService.updateLeave(sno, updatedData).subscribe(
      (response) => {
        console.log('Employee updated successfully:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Leave with S.No ${sno} updated successfully!`,
          life: 3000,
        });
        this.isSubmitting = false;
        this.cdr.detectChanges();
        this.holidayService.triggerRefresh();

        this.loadLeaves(); // Refresh the table
        this.visible = false; // Close the dialog
      },
      (error) => {
        console.error('Error updating employee:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to update leave with S.No ${sno}.`,
          life: 3000,
        });
        this.isSubmitting = false;
      }
    );
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const payload = {
      sno: 0,
      leaveCount: this.leaveForm.value.leaveCount || 0,
      leaveType: this.leaveForm.value.leaveType || '',
      leaveDescription: this.leaveForm.value.leaveDescription || '',
      leaveApplicable: this.leaveForm.value.leaveApplicable || '',
      leaveTransferable: this.leaveForm.value.leaveTransferable || '',
      leaveCashable: this.leaveForm.value.leaveCashable || '',
      leaveAction: this.leaveForm.value.leaveAction || false,
    };

    this.leaveService.createLeave(payload).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leave created successfully!' });
        this.hideDialog();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create leave. Please try again.' });
        console.error('Error creating leave:', error);
      },
    });
  }

  deleteEmployee(sno: number): void {
    if (!this.canDeleteLeave) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to delete leave.'
      });
      return;
    }

    this.isSubmitting = true;
    // Prevent default behavior, if needed
    if (!this.leaveForm.value.leaveDescription) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Description is required before deleting.',
        life: 3000,
      });
      this.isSubmitting = false;
      return; // Exit if no employee is selected
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the leave with serial number ${sno}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.leaveService.deleteLeave(sno).subscribe(
          (response) => {
            // Success: Show toaster notification
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Leave with serial number ${sno} deleted successfully!`,
              life: 3000, // Duration in milliseconds
            });
            this.isSubmitting = false;
            // Update the UI by removing the deleted item
            this.employees = this.employees.filter(employee => employee.sno !== sno);
            this.holidayService.triggerRefresh();
            this.visible = false;
          },
          (error) => {
            // Error: Show toaster notification
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `An error occurred while deleting the leave with serial number ${sno}.`,
              life: 3000, // Duration in milliseconds
            });
            this.isSubmitting = false;
            console.error('Error deleting leave:', error);
          }
        );
      }
    });
  }
  ngOnInit(): void {
    // this.getEmployeeData();

    this.canDeleteLeave = this.permissionService.hasPermission('LeaveMasterComponent', 'LeaveMasterDelete');
    this.canUpdateLeave = this.permissionService.hasPermission('LeaveMasterComponent', 'LeaveMasterUpdate');

  }
}
