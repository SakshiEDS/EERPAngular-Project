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
import { CheckboxModule } from "primeng/checkbox";
import { ToastrService } from "ngx-toastr";
import { LeaveMasterService } from "../../../services/leave-master.service";
import { PermissionService } from "../../../services/permission.service";

@Component({
  selector: 'app-weekoffdetails',
  templateUrl: './weekoffdetails.component.html',
  styleUrl: './weekoffdetails.component.scss',
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, IconFieldModule, InputIconModule, HttpClientModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, SliderModule, ProgressBarModule,
    FormsModule, AvatarModule, ReactiveFormsModule, ToastModule, CheckboxModule
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


export class WeekoffdetailsComponent implements OnInit {

  @ViewChild('dt') dt: Table | undefined; // Table reference
  selectedYear: number = new Date().getFullYear(); // For binding the selected year


  weekdays: any[] = [];

  // Options for the year dropdown
  yearOptions: any[] = [];

  clear(table: Table) {
    table.clear(); // Clear all table filters
    // Reset search input
  }





  // export class EmployeMasterComponent implements OnInit {
  employees: any[] = [];
  selectedEmployee: any;
  modalVisible: boolean = false;
  leaveForm!: FormGroup;
  visible = false;


  holidayForm!: FormGroup;

  canViewWeekOff: boolean = false;
  canAddWeekOff: boolean = false;
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private holidayService: HolidayService,
    private attenService: AttendanceService,
    private toastr: ToastrService,
    private leaveService: LeaveMasterService,
    private permissionService: PermissionService,

    private fb: FormBuilder,


    // private modalService: ModalService
  ) {


  }

  ngOnInit(): void {
    this.canViewWeekOff = this.permissionService.hasPermission(
      'WeekOff',
      'WeekOffView'
    );
    this.canAddWeekOff = this.permissionService.hasPermission(
      'WeekOff',
      'WeekOffAdd'
    );

    if (this.canViewWeekOff) {
      this.fetchWeekOffDetails();
    }

  }
  async fetchWeekOffDetails(): Promise<void> {
    try {
      // Await the result of the service call
      const data = await this.leaveService.getWeekOffDetails().toPromise();

      // Store the fetched data in the weekdays array
      if (data) {
        this.weekdays = data;
      } else {
        this.weekdays = []; // In case data is null or undefined, set it to an empty array
      }
      console.log(data);
    } catch (error) {
      console.error('Error fetching data', error);
      this.toastr.error('Failed to load Week Off details');
    }
  }

  isSubmitting = false; // Track if the button should be disabled
  // Track if the form is being submitted

  async saveWeekOffDetails(): Promise<void> {
    if (!this.canAddWeekOff) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permission Denied',
        detail: 'You do not have permission to Update or Add Week Off Details.'
      });
      return;
    }
    this.isSubmitting = true;
    try {
      // Prepare the data in the required format (array of objects)
      const updatedWeekOffDetails = this.weekdays.map(day => ({
        sno: day.sno,
        first: day.first,
        second: day.second,
        third: day.third,
        fouth: day.fouth,  // Corrected the typo 'fouth' to 'fourth'
        fifth: day.fifth
      }));

      // Send the data directly, without wrapping it in another object
      const response = await this.leaveService.updateWeekOffDetails(updatedWeekOffDetails).toPromise();

      console.log('Data posted successfully', response);

      // Show success message using MessageService
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Week Off details updated successfully!' });

      // Optionally, you can also show a Toastr notification
      this.toastr.success('Week Off details updated successfully!');

      // Disable the button after successful submission
      this.isSubmitting = false;  // Disable the button after success
    } catch (error) {
      console.error('Error posting data', error);

      // Show error message using MessageService
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while updating Week Off details.' });

      // Optionally, you can also show a Toastr notification
      this.toastr.error('An error occurred while updating Week Off details.');
      this.isSubmitting = false;

      // The button remains disabled if there's an error, no need to change isDisabled
    }
  }




}
