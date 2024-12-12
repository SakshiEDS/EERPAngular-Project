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
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

// import { CustomerService } from '../../../service/customerservice';
// import { Customer, Representative } from '../../../domain/customer';
import { CommonModule } from '@angular/common';
// import { EmployeDetailModalComponent } from "../employe-detail-modal/employe-detail-modal.component";
// import { EmployeeData } from "../employe-detail-modal/employe-detail-modal";
import { MessageService } from "primeng/api";
// import { CustomerService } from 'src/service/customerservice';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EmployeeService } from "../../../services/employee.service";
import { CustomerService } from "../../../../service/customerservice";
import { Customer, Representative } from "../../../../domain/customer";
import { LeaveMasterService } from "../../../services/leave-master.service";
import { LeaveApplicationComponent } from "../leave-application/leave-application.component";
import { LeaveViewComponent } from "../leave-view/leave-view.component";
import { HolidayService } from "../../../services/holiday.service";
import { PermissionService } from "../../../services/permission.service";
// import { EditComponent } from "../edit/edit.component";
// import { EmployeeService } from "../../services/employee.service";

@Component({
  selector: 'app-leave-table',
  templateUrl: './leave-table.component.html',
  styleUrl: './leave-table.component.scss',
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, IconFieldModule, InputIconModule, HttpClientModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, SliderModule, ProgressBarModule,
    FormsModule, AvatarModule,
    ReactiveFormsModule, ToastModule, ConfirmDialogModule,

    LeaveViewComponent
  ],
  providers: [CustomerService, MessageService, ConfirmationService],
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

export class LeaveTableComponent implements OnInit {
  customers!: Customer[];
  selectedCustomers!: Customer[];
  representatives!: Representative[];
  statuses!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  searchValue: string = ''; // Holds global search input value
  @ViewChild('dt') dt: Table | undefined; // Table reference
  showModal: boolean = false;



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

  getSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Pending":
        return "warning";
      case "Banned":
        return "danger";
      default:
        return undefined; // Ensure undefined instead of null
    }
  }
  openModal(employee: any) {
    // Optionally, you can pass employee data to populate the modal form
    console.log('Viewing employee:', employee);

    // Open the modal (set modalVisible to true)
    this.modalVisible = true;

    // You can also populate the modal with employee-specific data if needed
    // For example:
    this.selectedEmployee = employee;
  }




  employees: any[] = [];

  selectedEmployee: any;
  modalVisible: boolean = false;
  isEditModal: boolean = false;
  canViewLeaveTable: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private confirmationService: ConfirmationService,
    private LeaveMasterService: LeaveMasterService,
    private holidayService: HolidayService,
    private permissionService: PermissionService,
    // private modalService: ModalService
  ) { }
  ngOnInit(): void {
    this.canViewLeaveTable = this.permissionService.hasPermission('LeaveTableComponent', 'LeaveTableComponentView');
    if (this.canViewLeaveTable) {

      this.loadEmployees().then(() => {
        this.loadLeaveApplications();
      });

      this.holidayService.refresh$.subscribe(() => {
        this.loadLeaveApplications(); // Reload the data when notified
      });
    }



  }


  loadLeaveApplications() {
    this.LeaveMasterService.getLeaveApplications().subscribe({
      next: (data) => {
        // Assuming `data` is an array of leave applications with empCode
        this.employees.forEach(employee => {
          // Map leave data to employee data by matching empCode
          data = data.map((leave: any) => ({
            ...leave,  // Spread the existing leave data
            empName: this.getEmployeeNameByCode(leave.empCode), // Get empName from employees array
          }));
        });

        this.employees = data.map((leave, index) => ({
          sno: index + 1,
          leaveRequestCode: leave.sno,

          leaveStatus: leave.leaveStatus,
          empCode: leave.empCode,
          empName: leave.empName,  // Display empName in the table
          leaveApplyDate: leave.leaveApplyDate,
          fromDate: leave.leaveFromDate,
          toDate: leave.leaveToDate
        }));
        console.log(this.employees);

        this.loading = false; // Set loading to false once data is loaded
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load leave data.' });
      }
    });
  }
  getEmployeeNameByCode(empCode: string): string {
    const employee = this.employees.find(e => e.empCode === empCode);
    return employee ? employee.empName : 'Unknown Employee';  // Return a fallback if employee not found
  }



  async loadEmployees() {
    try {
      const data = await this.employeeService.getEmployeeData().toPromise(); // Convert Observable to Promise
      console.log("Employee data:", data);  // Log the raw employee data

      if (data && Array.isArray(data)) {
        // Check if each employee in the data has the `name` field
        this.employees = data.map((employee: any) => {
          console.log("Mapping employee:", employee); // Log each employee object
          return {
            empCode: employee.code,  // Ensure this is the correct field name for empCode
            empName: employee.name || 'No Name'  // Ensure this is the correct field for empName
          };
        });
        console.log('Employees loaded:', this.employees);  // Log the final employees array
      } else {
        this.employees = []; // Set as empty if the data is invalid
        console.warn('Invalid employee data received');
      }
    } catch (error) {
      console.error('Error loading employee data:', error);
    }
  }


}
