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
import { CustomerService } from "../../../../service/customerservice";
import { Customer, Representative } from "../../../../domain/customer";
import { EmployeeData } from "../../employe-detail-modal/employe-detail-modal";
// import { CreateNewLeaveModalComponent } from "../create-new-leave-modal/create-new-leave-modal.component";
import { LeaveMasterService } from "../../../services/leave-master.service";
import { CreateNewLeaveModalComponent } from "../create-new-leave-modal/create-new-leave-modal.component";
// import { LeaveMasterService } from "../../../../service/leave-master.service";
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { EditLeaveComponent } from "../../edit-leave/edit-leave.component";
import { HolidayService } from "../../../services/holiday.service";
import { PermissionService } from "../../../services/permission.service";

@Component({
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrl: './leave-master.component.scss',
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, IconFieldModule, InputIconModule, HttpClientModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, SliderModule, ProgressBarModule,
    FormsModule, AvatarModule, ReactiveFormsModule, CreateNewLeaveModalComponent, ToastModule,
    EditLeaveComponent
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
export class LeaveMasterComponent implements OnInit {
  customers!: Customer[];
  selectedCustomers!: Customer[];
  representatives!: Representative[];
  statuses!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  searchValue: string = ''; // Holds global search input value
  @ViewChild('dt') dt: Table | undefined; // Table reference


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
  employeeForm!: FormGroup;

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

  canViewLeave: boolean = false;

  canDeleteLeave: boolean = false;
  canUpdateLeave: boolean = false;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private leaveService: LeaveMasterService,
    private fb: FormBuilder,
    private holidayService: HolidayService,
    private permissionService: PermissionService,


    // private modalService: ModalService
  ) {

    this.leaveForm = this.fb.group({
      leaveDescription: [''],
      sno: [''],
      leaveType: [''],
      leaveApplicable: [''],
      leaveCount: [''],
      leaveTransferable: [''],
      leaveCashable: [''],
      leaveAction: [true], // Default value for leaveAction
    });

  }

  ngOnInit(): void {
    // this.getEmployeeData();
    this.canViewLeave = this.permissionService.hasPermission('LeaveMasterComponent', 'LeaveMasterView');
    this.canDeleteLeave = this.permissionService.hasPermission('LeaveMasterComponent', 'LeaveMasterDelete');
    this.canUpdateLeave = this.permissionService.hasPermission('LeaveMasterComponent', 'LeaveMasterUpdate');
    if (this.canViewLeave) {

      this.loadLeaves();

      // this.loadLeaves();
      this.holidayService.refresh$.subscribe(() => {
        this.loadLeaves();// Reload the data when notified
      });
    }

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
  showDialog() {
    this.visible = true;
    this.leaveForm.reset(); // Clear the form for new entry
  }
  editEmployee(employee: any) {
    console.log('Editing employee:', employee); // Debug log
    this.visible = true; // Show the dialog
    this.leaveForm.patchValue(employee);
    this.selectedEmployee = employee;// Prefill the form with employee data
  }

  isSubmitting = false;
  deleteEmployee(sno: number): void {
    // Prevent default behavior, if needed
    if (!this.canDeleteLeave) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to delete leave.'
      });
      return;
    }
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

  openEditDialog(employee: any): void {
    this.selectedEmployee = employee;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }
}

