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
// import { CustomerService } from "../../../service/customerservice";
// import { Customer, Representative } from "../../../domain/customer";
// import { HolidayComponent } from "../holiday/holiday.component";
// import { HolidayService } from "../../services/holiday.service";
// import { HolidayEditComponent } from "../holiday-edit/holiday-edit.component";
import { Validators } from '@angular/forms';
import { CustomerService } from "../../../../service/customerservice";
import { Customer, Representative } from "../../../../domain/customer";
import { HolidayService } from "../../../services/holiday.service";
import { AttendanceService } from "../../../services/attendance.service";

@Component({
  selector: 'app-attendance-table',
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.scss',
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, IconFieldModule, InputIconModule, HttpClientModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, SliderModule, ProgressBarModule,
    FormsModule, AvatarModule, ReactiveFormsModule, ToastModule,
    // HolidayComponent, HolidayEditComponent
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

export class AttendanceTableComponent implements OnInit {


  TodayDate: string = new Date().toISOString().split('T')[0];
  searchValue: string = ''; // Holds global search input value
  @ViewChild('dt') dt: Table | undefined; // Table reference // For bin


  globalFilter: string = '';

  employees: any[] = []; // Your employee data
  expandedRowKeys: { [key: string]: boolean } = {};
  // Options for the year dropdown
  yearOptions: any[] = [];

  selectedMonthYear: string = this.TodayDate.substr(0, 7);


  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  selectedEmployee: any;
  modalVisible: boolean = false;
  leaveForm!: FormGroup;
  visible = false;


  holidayForm!: FormGroup;




  ngOnInit(): void {
    this.fetchAttendance();
  }
  constructor(private attendanceService: AttendanceService) { }
  // Fetch data based on selected date
  fetchAttendance(): void {
    const [year, month] = this.selectedMonthYear.split('-'); // Extract year and month
    const employeeId = 104; // Hardcoded employee ID

    // Call the service to get the attendance data
    this.attendanceService.getEmployeeAttendance(employeeId, year, month).subscribe(
      (response: any) => {
        this.employees = response.completeAttendanceData.map((item: any) => ({
          code: response.empCode,
          name: response.empName,
          cardNo: item.cardNuumber || '--',
          shiftStart: item.shiftStartTime,
          shiftEnd: item.shiftEndTime,
          inTime: item.inTime || '--',
          outTime: item.outTime || '--',
          department: item.department || '--',
          designation: item.designation || '--',
          isPresent: item.isPresent,
          isAbsent: item.isAbsent,
          isHolidayorWeekoff: item.isHolidayorWeekoff,
          isLeave: item.isLeave,
          isHalfDay: item.isHalfDay,
          isMissedPunch: item.isMissedPunch,
          overTime: item.overTime
        }));
      },
      (error) => {
        console.error('Error fetching attendance:', error);
      }
    );
  }

  getAttendanceStatus(attendance: any): string {
    if (attendance.isPresent) {
      return 'Present';
    } else if (attendance.isAbsent) {
      return 'Absent';
    } else if (attendance.isHolidayorWeekoff) {
      return 'Holiday/Weekoff';
    } else if (attendance.isLeave) {
      return 'On Leave';
    } else if (attendance.isHalfDay) {
      return 'Half Day';
    } else if (attendance.isMissedPunch) {
      return 'Missed Punch';
    }
    return 'No Status';
  }
  toggleRow(employee: any) {
    this.expandedRowKeys[employee.id] = !this.expandedRowKeys[employee.id];
  }

  clear(table: Table) {
    table.clear(); // Clear all table filters
    this.expandedRowKeys = {}; // Reset expanded rows
    this.globalFilter = '';
  }



  showDialog() {
    this.visible = true;
    this.holidayForm.reset(); // Clear the form for new entry
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  // employees = [
  //   // Your employee data here
  // ];
  expandedRow: any = null;

  onRowExpand(event: any) {
    this.expandedRow = event.data;
  }


  products = [
    { code: 'P001', name: 'Product 1', category: 'Category 1', quantity: 10 },
    { code: 'P002', name: 'Product 2', category: 'Category 2', quantity: 20 },
    { code: 'P003', name: 'Product 3', category: 'Category 1', quantity: 30 },
    { code: 'P004', name: 'Product 4', category: 'Category 3', quantity: 40 },
    { code: 'P005', name: 'Product 5', category: 'Category 2', quantity: 50 },
  ];



  searchText: string = '';

  filterTable() {
    this.dt?.filterGlobal(this.searchText, 'contains');
  }

  clearSearch() {
    this.searchText = '';
    this.dt?.filterGlobal('', 'contains');
  }


}


