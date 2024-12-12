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
// import { CustomerService } from "../../../../service/customerservice";
// import { Customer, Representative } from "../../../../domain/customer";

// import { CreateNewLeaveModalComponent } from "../create-new-leave-modal/create-new-leave-modal.component";

// import { LeaveMasterService } from "../../../../service/leave-master.service";
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { CustomerService } from "../../../service/customerservice";
import { Customer, Representative } from "../../../domain/customer";
import { HolidayComponent } from "../holiday/holiday.component";
import { HolidayService } from "../../services/holiday.service";
import { HolidayEditComponent } from "../holiday-edit/holiday-edit.component";
import { Validators } from '@angular/forms';
import { PermissionService } from "../../services/permission.service";


@Component({
  selector: 'app-holiday-table',
  templateUrl: './holiday-table.component.html',
  styleUrl: './holiday-table.component.scss',
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, IconFieldModule, InputIconModule, HttpClientModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, SliderModule, ProgressBarModule,
    FormsModule, AvatarModule, ReactiveFormsModule, ToastModule,
    HolidayComponent, HolidayEditComponent
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

export class HolidayTableComponent implements OnInit {

  @ViewChild('editComponent') editComponent!: HolidayEditComponent;
  customers!: Customer[];
  selectedCustomers!: Customer[];
  representatives!: Representative[];
  statuses!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  searchValue: string = ''; // Holds global search input value
  @ViewChild('dt') dt: Table | undefined; // Table reference
  selectedYear: number = new Date().getFullYear(); // For binding the selected year

  // Options for the year dropdown
  yearOptions: any[] = [];

  clear(table: Table) {
    table.clear(); // Clear all table filters
    this.searchValue = ''; // Reset search input
  }

  applyGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }


  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }


  // export class EmployeMasterComponent implements OnInit {
  employees: any[] = [];
  selectedEmployee: any;
  modalVisible: boolean = false;
  leaveForm!: FormGroup;
  visible = false;


  holidayForm!: FormGroup;

  canUpdateHoliday: boolean = false;
  canDeleteHoliday: boolean = false;
  canViewHoliday: boolean = false;
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private holidayService: HolidayService,
    private permissionService: PermissionService,

    private fb: FormBuilder,


    // private modalService: ModalService
  ) {
    this.holidayForm = this.fb.group({
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],  // Use only one date field
      isHoliday: [false],
      isWorkingDay: [false]
    });

  }

  ngOnInit(): void {

    this.canViewHoliday = this.permissionService.hasPermission('Holiday', 'HolidayView');
    this.canUpdateHoliday = this.permissionService.hasPermission('Holiday', 'HolidayUpdate');
    this.canDeleteHoliday = this.permissionService.hasPermission('Holiday', 'HolidayDelete');
    if (this.canViewHoliday) {
      this.loadHolidays();

      // Subscribe to the refresh event
      this.holidayService.refresh$.subscribe(() => {
        this.loadHolidays(); // Reload the data when notified
      });

      this.generateYearOptions();
    }

    // this.canViewHoliday = this.permissionService.hasPermission('Holiday', 'HolidayView');
    // this.canUpdateHoliday = this.permissionService.hasPermission('Holiday', 'HolidayUpdate');
    // this.canDeleteHoliday = this.permissionService.hasPermission('Holiday', 'HolidayDelete');


  }
  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const years = [];

    // Adding previous years (e.g., last 10 years) and current year
    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push({ label: year.toString(), value: year });
    }

    // Assigning the years to yearOptions
    this.yearOptions = years;
    this.selectedYear = currentYear; // Set default to current year
  }

  // Method to filter the employees by the selected year
  filterByYear(event: any) {
    console.log('Dropdown Event:', event); // Check the structure of event
    const selectedYear = event.value ? event.value.value : null; // Extract the year value
    console.log('Selected Year:', selectedYear);

    if (selectedYear && !isNaN(selectedYear)) {
      // Logic for selecting current year or specific year
      if (selectedYear === new Date().getFullYear()) {
        this.loadHolidays();
      } else {
        this.loadHolidaysByYear(selectedYear);
      }
    }
  }


  loadHolidaysByYear(year: number): void {
    console.log('Fetching holidays for year:', year); // Debug log to check the correct year

    this.holidayService.getHolidaysByYear(year).subscribe(
      (data) => {
        if (data && data.length > 0) {
          // If data is available, assign it to the 'employees' array
          this.employees = data;
        } else {
          // If no data is found for the selected year, clear the table
          this.employees = [];
          console.log('No holidays found for the selected year');
        }
      },
      (error) => {
        console.error('Error fetching holidays by year:', error);
        this.employees = []; // Ensure the table is cleared on error
      }
    );
  }


  showDialog() {
    this.visible = true;
    this.holidayForm.reset(); // Clear the form for new entry
  }





  closeModal(): void {
    this.modalVisible = false;
  }
  loadHolidays() {
    this.holidayService.getHolidays().subscribe(
      (data) => {
        this.employees = data;


      },
      (error) => {
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load holidays' });

        console.error('Error fetching holidays:', error);
      }
    );
  }

  editEmployee(employee: any) {
    console.log('Editing employee:', employee); // Debug log
    this.editComponent.showDialog(employee); // Pass data to child component and open dialog
  }

  isSubmitting = false;
  deleteEmployee(sno: number): void {
    if (!this.canDeleteHoliday) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to delete Holiday.'
      });
      return;
    }
    // Prevent default behavior, if needed
    this.isSubmitting = true;
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
        this.holidayService.deleteHoliday(sno).subscribe(
          (response) => {
            // Success: Show toaster notification
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Holiday with serial number ${sno} deleted successfully!`,
              life: 3000, // Duration in milliseconds
            });
            this.isSubmitting = false;

            // Update the UI by removing the deleted item
            this.loadHolidays();
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
}
