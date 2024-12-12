import { Component, OnInit, ViewChild } from "@angular/core";
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
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.scss',
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

export class HolidayComponent {
  holidayForm!: FormGroup;
  visible: boolean = false;  // To show/hide the dialog
  canAddHoliday: boolean = false;
  constructor(
    private fb: FormBuilder,
    private holidayService: HolidayService, // Inject the service
    private toastService: ToastrService,
    private messageService: MessageService,
    private permissionService: PermissionService,
    // Optional, for showing success/error messages
  ) { }

  ngOnInit(): void {
    this.holidayForm = this.fb.group({
      eventName: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      isHoliday: [false],
      isWorkingDay: [false]
    });

    this.canAddHoliday = this.permissionService.hasPermission('Holiday', 'HolidayAd');
  }

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }
  isSubmitting = false;

  onSubmit(event: Event) {
    if (!this.canAddHoliday) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to Add Holiday.'
      });
      return;
    }
    event.preventDefault();

    // Disable the Save button
    this.isSubmitting = true;

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
          this.hideDialog();
          this.isSubmitting = false;  // Close dialog after success
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add holiday!' });
          console.error('Error posting holiday data:', error);
        },
        () => {
          // Reset the submitting state once the request is completed
          this.isSubmitting = false;
        }
      );
    } else {
      this.holidayForm.markAllAsTouched();
      // Handle form validation errors
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all required fields!' });
      this.isSubmitting = false; // Reset the flag if form is not valid
    }
  }

}
