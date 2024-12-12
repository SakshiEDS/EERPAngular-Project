import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
import { EmployeeData } from '../../employe-detail-modal/employe-detail-modal';
import { LeaveMasterService } from '../../../services/leave-master.service';
import { HolidayService } from '../../../services/holiday.service';
import { PermissionService } from '../../../services/permission.service';






@Component({
  selector: 'app-create-new-leave-modal',
  templateUrl: './create-new-leave-modal.component.html',
  styleUrl: './create-new-leave-modal.component.scss',
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
export class CreateNewLeaveModalComponent {

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



  // @Input() visible: boolean = false;  

  closeModal() {
    this.visible = false;
  }
  canViewLeave: boolean = false;
  canAddLeave: boolean = false;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private leaveService: LeaveMasterService,
    private messageService: MessageService,
    private holidayService: HolidayService,
    private permissionService: PermissionService,
  ) {
    this.leaveForm = this.fb.group({
      leaveDescription: ['', Validators.required],
      sno: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]], // Only numeric input for sno
      leaveType: ['', Validators.required],
      leaveApplicable: ['', Validators.required],
      leaveCount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Only numeric input for leaveCount
      leaveTransferable: ['', Validators.required],
      leaveCashable: ['', Validators.required],
      leaveAction: [false],
    });

  }
  ngOnInit(): void {
    // this.canViewLeave = this.permissionService.hasPermission('LeaveMasterComponent', 'LeaveMasterView');
    this.canAddLeave = this.permissionService.hasPermission('LeaveMasterComponent', 'LeaveMasterAdd');
    this.fetchNextSerialNumber();
    this.holidayService.refresh$.subscribe(() => {
      this.fetchNextSerialNumber();// Reload the data when notified
    });
  }
  showDialog() {
    this.visible = true;
    this.fetchNextSerialNumber();


    // Fetch the next serial number from the API

  }
  fetchNextSerialNumber(): void {
    this.leaveService.getNextSerialNumber().subscribe({
      next: (response) => {
        this.leaveForm.patchValue({ sno: response }); // Populate the 'sno' field in the form
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch next serial number.' });
        console.error('Error fetching next serial number:', error);
      },
    });
  }

  hideDialog() {
    this.visible = false;
  }
  editEmployee(employee: any) {
    console.log('Editing employee:', employee); // Debug log
    this.visible = true; // Show the dialog
    this.leaveForm.patchValue(employee);  // Prefill the form with employee data
  }
  isSubmitting = false;
  onSubmit(event: Event) {
    if (!this.canAddLeave) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to Add leave.'
      });
      return;
    }
    event.preventDefault();
    this.isSubmitting = true;

    // Check if the form is valid
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      // Trigger validation feedback (you can use a toast or alert)
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill all required fields correctly.' });
      return; // Prevent form submission if invalid
    }

    // Form is valid, proceed with form submission
    const payload = {
      sno: this.leaveForm.value.sno, // Keep the sno as it is
      leaveCount: this.leaveForm.value.leaveCount || 0,
      leaveType: this.leaveForm.value.leaveType || '',
      leaveDescription: this.leaveForm.value.leaveDescription || '',
      leaveApplicable: this.leaveForm.value.leaveApplicable || '',
      leaveTransferable: this.leaveForm.value.leaveTransferable || '',
      leaveCashable: this.leaveForm.value.leaveCashable || '',
      leaveAction: this.leaveForm.value.leaveAction || false,
    };

    // Call the service to submit the leave data
    this.leaveService.createLeave(payload).subscribe({
      next: (response) => {
        // Show success message
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leave created successfully!' });
        this.isSubmitting = false;

        // Reset form fields except sno (Code)
        this.leaveForm.reset({
          sno: this.leaveForm.value.sno // Preserve the sno value
        });

        this.holidayService.triggerRefresh();
        // Hide the dialog
        this.hideDialog();
      },
      error: (error) => {
        // Show error message
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create leave. Please try again.' });
        this.isSubmitting = false;
        console.error('Error creating leave:', error);
      },
    });
  }


}
