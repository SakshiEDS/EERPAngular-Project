import { Component, Input, OnInit, ViewChild } from "@angular/core";
// import { Customer, Representative } from "../../../domain/customer";
import { Table, TableModule } from "primeng/table";
// import { CustomerService } from "../../../service/customerservice";
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
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

// import { CustomerService } from '../../../service/customerservice';
// import { Customer, Representative } from '../../../domain/customer';
import { CommonModule } from '@angular/common';
// import { EmployeDetailModalComponent } from "../employe-detail-modal/employe-detail-modal.component";
// import { EmployeeData } from "../employe-detail-modal/employe-detail-modal";
import { MessageService } from "primeng/api";
// import { CustomerService } from "../../../../service/customerservice";
// import { Customer, Representative } from "../../../../domain/customer";
// import { EmployeeData } from "../../employe-detail-modal/employe-detail-modal";
// import { CreateNewLeaveModalComponent } from "../create-new-leave-modal/create-new-leave-modal.component";
// import { LeaveMasterService } from "../../../services/leave-master.service";
// import { CreateNewLeaveModalComponent } from "../create-new-leave-modal/create-new-leave-modal.component";
// import { LeaveMasterService } from "../../../../service/leave-master.service";
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
// import { EditLeaveComponent } from "../../edit-leave/edit-leave.component";
import { CustomerService } from "../../../service/customerservice";
import { DialogModule } from "primeng/dialog";
import { Checkbox, CheckboxModule } from "primeng/checkbox";
import { HolidayService } from "../../services/holiday.service";
import { ToastrService } from "ngx-toastr";
import { Validators } from '@angular/forms';
import { PermissionService } from "../../services/permission.service";

@Component({
  selector: 'app-holiday-edit',
  templateUrl: './holiday-edit.component.html',
  styleUrl: './holiday-edit.component.scss',
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, IconFieldModule, InputIconModule, HttpClientModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, SliderModule, ProgressBarModule,
    FormsModule, AvatarModule, ReactiveFormsModule, ToastModule, DialogModule, CheckboxModule

  ],
  providers: [CustomerService, MessageService],
  styles: [
    `
    /* Responsive Table for Smaller Screens */
    @media screen and (max-width: 960px) {
      :host ::ng-deep .p-datatable.p-datatable-customers {
          .p-datatable-thead > tr > th,
          .p-datatable-tfoot > tr > td {
              display: none !important;
          }
          .p-datatable-tbody > tr {
              border-bottom: 1px solid var(--layer-2);
              display: flex;
              flex-direction: column;
              padding: 0.5rem;
          }
          .p-datatable-tbody > tr > td {
              display: flex;
              align-items: center;
              padding: 0.5rem 0;
              text-align: left;
              width: 100%;
          }
          .p-datatable-tbody > tr > td .p-column-title {
              min-width: 30%;
              font-weight: bold;
              display: inline-block;
          }
          p-progressbar {
              width: 100%;
          }
      }
    }
    `
  ],
})

export class HolidayEditComponent {

  @Input() employeeData: any;
  holidayForm!: FormGroup;
  visible: boolean = false;
  // Flag to track if in edit mode
  selectedEmployeeId: number | null = null; // To show/hide the dialog
  selectedEmployee: any;

  canUpdateHoliday: boolean = false;
  constructor(
    private fb: FormBuilder,
    private holidayService: HolidayService, // Inject the service
    private toastService: ToastrService,
    private messageService: MessageService,
    private permissionService: PermissionService, // Optional, for showing success/error messages
  ) { }

  ngOnInit(): void {
    this.holidayForm = this.fb.group({
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],  // Use only one date field
      isHoliday: [false],
      isWorkingDay: [false]
    });
    this.canUpdateHoliday = this.permissionService.hasPermission('Holiday', 'HolidayUpdate');
  }



  showDialog(employee: any) {
    this.employeeData = employee; // Store the employee data
    this.selectedEmployeeId = employee.sno; // Get the employee ID (assuming 'sno' is the ID)
    this.holidayForm.patchValue(employee); // Prefill the form
    this.visible = true; // Show the dialog
  }
  hideDialog() {
    this.visible = false;
    this.selectedEmployeeId = null; // Reset ID
    this.holidayForm.reset(); // Reset form
  }


  onSubmit(event: Event) {
    event.preventDefault();
    if (this.holidayForm.valid) {
      const holidayData = {
        eventName: this.holidayForm.value.eventName,
        dateFrom: this.holidayForm.value.dateFrom,
        dateTo: this.holidayForm.value.dateTo,
        isHoliday: this.holidayForm.value.isHoliday,
        isWorkingDay: this.holidayForm.value.isWorkingDay
      };

      // Use the service to post the holiday data
      this.holidayService.addHoliday(holidayData).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Holiday added successfully!' });
          this.holidayService.triggerRefresh();
          this.hideDialog(); // Close dialog after success
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add holiday!' });
          console.error('Error posting holiday data:', error);
        }
      );
    } else {
      // Handle form validation errors
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all required fields!' });
    }
  }

  isSubmitting = false;
  updateHoliday(event: Event): void {
    if (!this.canUpdateHoliday) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to Update Holiday.'
      });
      return;
    }
    event.preventDefault();
    this.isSubmitting = true;

    // Add validation check
    if (this.holidayForm.valid) {
      const eventId = this.employeeData.sno; // Assuming `sno` is the ID of the holiday
      const url = `http://13.233.79.234:8080/api/HolidayList/EditHoliday/${eventId}`; // Construct the API URL for update
      const updatedData = this.holidayForm.value; // Get the form data for the update

      // Call the service to update the holiday
      this.holidayService.updateHoliday(eventId, updatedData).subscribe(
        (response) => {
          console.log('Holiday updated successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Holiday with Event Name "${updatedData.eventName}" updated successfully!`,
            life: 3000 // Duration for the success message
          });
          this.isSubmitting = false;

          this.holidayService.triggerRefresh(); // Optionally refresh the data after update
          this.hideDialog(); // Close the dialog after success
        },
        (error) => {
          console.error('Error updating holiday:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to update holiday with Event Name "${updatedData.eventName}".`,
            life: 3000 // Duration for the error message
          });
          this.isSubmitting = false;
        }
      );
    } else {
      // Handle form validation errors
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly!',
        sticky: true // Ensure it stays visible until dismissed manually
      });
      this.isSubmitting = false;
    }
  }



}
