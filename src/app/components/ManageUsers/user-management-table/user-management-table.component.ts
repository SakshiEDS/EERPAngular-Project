import { Component, OnInit, ViewChild } from "@angular/core";
import { RowToggler, Table, TableModule } from "primeng/table";
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
import { CreateNewUsersModalComponent } from "../create-new-users-modal/create-new-users-modal.component";
import { HttpClient } from "@angular/common/http";
import { EmployeeService } from "../../../services/employee.service";
import { forkJoin, map } from "rxjs";
import { UserEditComponent } from "../user-edit/user-edit.component";
import { UserServiceService } from "../../../services/user-service.service";
import { MessageService } from "primeng/api";
import { CreateNewLeaveModalComponent } from "../../Leave-Sections/create-new-leave-modal/create-new-leave-modal.component";
import { HolidayService } from "../../../services/holiday.service";
import { PermissionService } from "../../../services/permission.service";

@Component({
  selector: 'app-user-management-table',
  templateUrl: './user-management-table.component.html',
  styleUrl: './user-management-table.component.scss',
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, IconFieldModule, InputIconModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, SliderModule, ProgressBarModule,
    FormsModule, AvatarModule, ReactiveFormsModule,
    UserEditComponent,

    CreateNewUsersModalComponent
  ],

})
export class UserManagementTableComponent implements OnInit {

  searchValue: string = '';
  @ViewChild('dt') dt: Table | undefined;
  globalFilter: string = '';

  expandedRowKeys: { [key: string]: boolean } = {};


  canViewUser: boolean = false;
  canUpdateUser: boolean = false;


  toggleRow(employee: any) {
    this.expandedRowKeys[employee.id] = !this.expandedRowKeys[employee.id];
  }

  onRowExpand(event: any) {
    console.log('Row Expanded: ', event.data);
  }

  onRowCollapse(event: any) {
    console.log('Row Collapsed: ', event.data);
  }

  clear(table: Table) {
    table.clear();
    this.expandedRowKeys = {};
    this.globalFilter = '';
  }

  searchText: string = '';

  filterTable() {
    this.dt?.filterGlobal(this.searchText, 'contains');
  }

  clearSearch() {
    this.searchText = '';
    this.dt?.filterGlobal('', 'contains');
  }


  // employees: any[] = [];
  // expandedRowKeys: { [key: string]: boolean } = {};

  // Sorting variables
  sortField: string = 'loginName';  // Set default sort field
  sortOrder: number = 1;  // 1 for ascending, -1 for descending



  // You can implement custom sorting logic if needed
  sortTable(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1; // Toggle sort direction
  }
  employees: any[] = [];  // This will hold the employee data

  constructor(private http: HttpClient, private employeeService: EmployeeService, private userservice: UserServiceService, private messageService: MessageService, private holidayService: HolidayService, private permissionService: PermissionService,) { }

  ngOnInit(): void {
    this.canViewUser = this.permissionService.hasPermission(
      'ManageUsersPermission',
      'ManageUsersPermissionView'
    );
    this.canUpdateUser = this.permissionService.hasPermission(
      'ManageUsersPermission',
      'ManageUsersPermissionUpdate'
    );
    if (this.canViewUser) {
      this.fetchEmployeeData();
      this.holidayService.refresh$.subscribe(() => {
        this.fetchEmployeeData(); // Reload the data when notified
      });
    }



    // Fetch employee data when the component initializes
  }

  fetchEmployeeData(): void {
    this.userservice.getAllEmployeeData().subscribe(
      (employeeData) => {
        const employeeRequests = employeeData.map((emp) => {
          // For each employee, get their name using their empCode
          return this.employeeService.getEmployeeNameByCode(emp.empCode).pipe(
            map((employeeName: string | null) => ({
              sno: emp.sno,
              name: employeeName || 'Unknown',  // Set employee name or 'Unknown' if not found
              email: emp.emailId,
              phone: emp.mobileNumber,
              compCode: emp.empCode,  // If you want to show permissionId as compCode
              company: emp.allowedCompany  // Replace with actual company name if available
            }))
          );
        });

        // Use forkJoin to wait for all employee name requests to complete
        forkJoin(employeeRequests).subscribe((employeeDataWithNames) => {
          this.employees = employeeDataWithNames;  // Store the combined data
        });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch employee data.' });
      }
    );
  }
}