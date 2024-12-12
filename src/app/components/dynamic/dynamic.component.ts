import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectItem } from 'primeng/api'; // For dropdown options
import { FileUpload } from 'primeng/fileupload'; // If using file upload
import { FormsModule } from '@angular/forms';  // To support ngModel binding
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
// import { ApiService } from '../../api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { EmployeeData } from './employe-detail-modal';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { ModalService } from '../../modal.service';
import { LateandoutComponent } from "../lateandout/lateandout.component";
import { LateoutService } from '../../services/lateout.service';
import { firstValueFrom } from 'rxjs';
import { HolidayService } from '../../services/holiday.service';
import { ConfigService } from '../../services/config.service';
// import { DynamicComponent } from '../dynamic/dynamic.component';




interface Employee {
  sno: number;
  empCode: number;
  empName: string;
  empImage: string;
  empFatherName: string;
  empLogin?: boolean; // Optional if not always present
}


@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrl: './dynamic.component.scss',
  standalone: true,
  imports: [DialogModule, ButtonModule, FormsModule, // Make sure you have FormsModule for ngModel
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
    DynamicComponent, LateandoutComponent],
})
export class DynamicComponent {

  @Output() citySelected = new EventEmitter<any>(); // Emit selected city

  // Rest of the component code...

  stateOptions: any[] = []; // Store state dropdown options
  selectedState: any = null; // Store selected state
  // Helper method to convert time to hh:mm:ss format
  formatTimeToHHMMSS(time: string): string {
    if (!time) return '00:00:00'; // Return a default time if no value

    const [hours, minutes] = time.split(':'); // Split the input time
    return `${hours}:${minutes}:00`; // Add seconds as '00'
  }

  displayModal: boolean = false;
  displayEditDialog: boolean = false;
  searchTerm: string = '';
  items: any[] = [];
  selectedItem: any = null;
  context: any = {};
  editItem: any = { sno: '', name: '', activeStatus: false };
  @Input() contextParam: string | undefined;

  @Output() countryChanged = new EventEmitter<number | undefined>();

  constructor(private http: HttpClient,
    private messageService: MessageService,
    private lateInRuleService: LateoutService,
    private cdRef: ChangeDetectorRef,
    private holidayService: HolidayService,
    private configService: ConfigService


  ) { }

  ngOnInit(): void {
    this.loadData();
    this.holidayService.refresh$.subscribe(() => {
      this.loadData(); // Reload the data when notified
    });
  }
  ngOnChanges(): void {
    if (this.contextParam) {
      this.setContext(this.contextParam);
      this.holidayService.refresh$.subscribe(() => {
        this.loadData(); // Reload the data when notified
      });
    }
  }



  setContext(context: string): void {
    this.context = this.configService.getContextConfig(context);
  }
  // Set context dynamically





  // getContextConfig(context: string): { apiUrl: string; label: string } | undefined {
  //   const configs: { [key: string]: { apiUrl: string; label: string } } = {
  //     bank: { apiUrl: 'http://13.233.79.234/eERPapi/api/Bank', label: 'Bank' },
  //     city: { apiUrl: 'http://13.233.79.234/eERPapi/api/City', label: 'City' },
  //     state: { apiUrl: 'http://13.233.79.234/eERPapi/api/StateDetails', label: 'State' },
  //     department: { apiUrl: 'http://13.233.79.234/eERPapi/api/Department', label: 'Department' },
  //     designation: { apiUrl: 'http://13.233.79.234/eERPapi/api/Designation', label: 'Designation' },
  //     lateIn: { apiUrl: 'http://13.233.79.234/eERPapi/api/LateinRule', label: 'Late In' },
  //     reportingTo: { apiUrl: 'http://13.233.79.234/eERPapi/api/EmpDetails', label: 'Reporting To' },
  //     shift: { apiUrl: 'http://13.233.79.234/eERPapi/api/Shift', label: 'Shift' },
  //     out: { apiUrl: 'http://13.233.79.234/eERPapi/api/EarlyOutRule', label: 'Early Out' },
  //     country: { apiUrl: 'http://13.233.79.234/eERPapi/api/Country', label: 'Country' }, // Ensure category API URL is added
  //   };

  //   return configs[context] || undefined;
  // }

  countryCode: number | undefined;  // To store the selected country code
  states: any[] = [];
  loadData(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.context.apiUrl) {
        this.http.get<any>(this.context.apiUrl).subscribe(
          (data) => {
            if (this.context.label.toLowerCase() === 'reporting to') {
              // Retain existing logic for reportingTo
              const empDetail = data.empDetail;
              if (empDetail && empDetail.length > 0) {
                this.items = empDetail.map((emp: Employee) => ({
                  sno: emp.empCode,
                  name: emp.empName,
                  activeStatus: emp.empLogin ?? false,
                }));
              } else {
                this.items = [];
              }
            } else if (this.context.label.toLowerCase() === 'shift') {
              // Add specific logic for 'shift' context
              this.items = Array.isArray(data)
                ? data.map((item) => ({
                  sno: item.sno,
                  name: item.name,
                  activeStatus: item.activeStatus,
                  shiftInTime: item.shiftInTime,
                  shiftOutTime: item.shiftOutTime,
                }))
                : [];
            } else {
              // General logic for other contexts
              this.items = Array.isArray(data)
                ? data.map((item) => ({
                  sno: item.sno,
                  name: this.getItemName(item),
                  activeStatus: item.activityStatus,
                }))
                : [];
            }

            resolve();
          },
          (error) => {

            // reject(error);
          }
        );
      } else {
        reject('Invalid API URL');
      }
    });
  }





  getItemName(item: any): string {
    switch (this.context.label.toLowerCase()) {
      case 'bank':
        return item.bankName || item.name;
      case 'city':
        return item.cityName || item.name;
      case 'state':
        return item.stateName || item.name;
      case 'department':
        return item.departmentName || item.name;
      case 'designation':
        return item.designationName || item.name;
      case 'out':
      case 'lateIn':
      case 'shift':
        return item.name;
      case 'reportingTo':
        return item.empDetail?.empName || item.name;
      case 'country':
        return item.countryName || item.name;

      default:
        return item.name;
    }
  }

  filteredItems() {
    return this.items
      .map((item) => ({
        label: this.contextParam === 'bank'
          ? (item.sno ? String(item.sno) : '')
          : (
            item.name || item.cityName || item.bankName ||
            item.countryName || item.empName || item.designationName ||
            item.departmentName || item.stateName || ''
          ),
        value: item.sno || item.id,
      }))
      .filter((item) =>
        item.label && item.label.toLowerCase().includes((this.searchTerm || '').toLowerCase())
      );
  }




  // Method to open the edit dialog (for both new and existing items)
  async openEditDialog(context: string, selectedItem?: any): Promise<void> {
    // console.log('Opening Edit Dialog for Context:', context, 'Selected Item:', selectedItem);
    // console.log('Selected Item:', selectedItem);
    // console.log('Items:', this.items);

    this.context = this.configService.getContextConfig(context); // Set the context
    console.log(context);

    if (this.context.apiUrl) {
      try {
        await this.loadData();

        if (selectedItem) {
          // Prefill dialog fields based on selected item
          const matchedItem = this.items.find((item) => item.sno === selectedItem);
          if (matchedItem) {
            if (this.context.label.toLowerCase() === 'shift') {
              // Add handling for the 'shift' context
              this.editItem = {
                sno: matchedItem.sno,
                name: matchedItem.name,
                activeStatus: matchedItem.activeStatus ?? false,
                shiftInTime: matchedItem.shiftInTime, // Prefill shiftInTime
                shiftOutTime: matchedItem.shiftOutTime, // Prefill shiftOutTime
              };
            } else {
              // Retain existing logic for reportingTo and other contexts
              this.editItem = {
                sno: matchedItem.sno,
                name: matchedItem.name,
                activeStatus: matchedItem.activeStatus ?? false,
              };
            }

            console.log('Prefilled with matched item:', matchedItem);
            this.isNewItemFlag = false; // Set flag for existing item
          }
        } else {
          // Handle new item creation
          const nextSerialNumberUrl = `${this.context.apiUrl}/nextSerialNumber`;

          if (this.context.label.toLowerCase() === 'bank') {
            // Include token for the 'bank' context
            const token = localStorage.getItem('authToken'); // Retrieve the token
            const headers = new HttpHeaders({
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            });

            this.http.get<number>(nextSerialNumberUrl, { headers }).subscribe(
              (response) => {
                if (typeof response === 'number') {
                  this.editItem = {
                    sno: response, // New serial number for new item
                    name: '',
                    activeStatus: false,
                  };
                  console.log('Next serial number fetched for new item:', response);
                  this.isNewItemFlag = true; // Set flag for new item
                }
              },
              (error) => {
                // console.error('Error fetching next serial number:', error);
              }
            );
          } else {
            // Default behavior for other contexts (no token required)
            this.http.get<number>(nextSerialNumberUrl).subscribe(
              (response) => {
                if (typeof response === 'number') {
                  this.editItem = {
                    sno: response, // New serial number for new item
                    name: '',
                    activeStatus: false,
                  };
                  console.log('Next serial number fetched for new item:', response);
                  this.isNewItemFlag = true; // Set flag for new item
                }
              },
              (error) => {
                console.error('Error fetching next serial number:', error);
              }
            );
          }
        }

        this.displayEditDialog = true; // Open the dialog
        console.log('Edit Dialog opened for context:', this.context.label);
      } catch (error) {
        console.error('Error fetching next serial number or loading data:', error);
      }
    } else {
      console.error('Invalid context provided for edit dialog.');
    }
  }
  isSubmitting = false;
  // Method to save the item (POST or PUT)
  saveEdit(event: Event): void {
    event.preventDefault();
    this.isSubmitting = true;

    // Check if editItem has a name and sno
    if (!this.editItem.name || !this.editItem.sno) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Name and Serial Number are required.',
        life: 3000,
      });
      this.isSubmitting = false;
      return; // Exit if validation fails
    }

    let payload: any = {
      sno: this.editItem.sno,
      activeStatus: this.editItem.activeStatus ?? false, // Default to false if not provided
    };

    // Dynamically add fields based on the context
    switch (this.context.label.toLowerCase()) {
      case 'bank':
        payload.bankName = this.editItem.name;
        break;
      case 'city':
        payload.cityName = this.editItem.name;
        break;
      case 'state':
        payload.stateName = this.editItem.name;
        break;
      case 'department':
        payload.departmentName = this.editItem.name;
        break;
      case 'designation':
        payload.designationName = this.editItem.name;
        break;
      case 'country':
        payload.countryName = this.editItem.name;
        break;
      case 'lateIn':
        payload.name = this.editItem.name;
        break;
      case 'out':
        payload.name = this.editItem.name;
        break;
      case 'shift':
        // Handle the 'shift' context
        payload.name = this.editItem.name;
        payload.shiftInTime = this.formatTimeToHHMMSS(this.editItem.shiftInTime); // Convert time format
        payload.shiftOutTime = this.formatTimeToHHMMSS(this.editItem.shiftOutTime); // Convert time format
        console.log(payload);
        break;
      default:
        console.error('Unknown context, could not map properties');
        this.isSubmitting = false;
        return; // Exit if context is unknown
    }

    // Perform POST or PUT based on whether the item is new or existing
    const apiUrl = this.context.apiUrl;
    let requestObservable;

    if (this.isNewItemFlag) {
      // New item, perform POST
      requestObservable = this.http.post(apiUrl, payload);
    } else {
      // Existing item, perform PUT
      requestObservable = this.http.put(`${apiUrl}/${this.editItem.sno}`, payload);
    }

    // Execute the API request
    requestObservable.subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.context.label} data ${this.isNewItemFlag ? 'posted' : 'updated'} successfully!`,
          life: 3000,
        });
        this.holidayService.triggerRefresh();
        this.loadData(); // Refresh the data
        this.isSubmitting = false;
        this.displayEditDialog = false; // Close the modal
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `An error occurred while ${this.isNewItemFlag ? 'posting' : 'updating'} ${this.context.label} data.`,
          life: 3000,
        });
        this.isSubmitting = false;
        console.error(`Error ${this.isNewItemFlag ? 'posting' : 'updating'} ${this.context.label} data:`, error);
      }
    );
  }


  // Helper method to check if the item is new based on flag
  isNewItemFlag: boolean = false;  // Initialize flag

  deleteItem(sno: number, event: Event): void {
    event.preventDefault();
    this.isSubmitting = true;

    // Validate if an item is selected for deletion (i.e., editItem should exist and have a valid sno)
    if (!this.editItem || !this.editItem.name) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'No item selected for deletion. Please select an item before proceeding.',
        life: 3000,
      });
      this.isSubmitting = false;
      return; // Exit if no item is selected
    }

    // Confirm the deletion with the user
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the ${this.context.label} with serial number ${this.editItem.sno}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteUrl = `${this.context.apiUrl}/${this.editItem.sno}`; // Construct the URL with sno

        this.http.delete(deleteUrl).subscribe(
          (response) => {
            // Handle successful deletion
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `${this.context.label} with serial number ${this.editItem.sno} deleted successfully!`,
              life: 3000,
            });
            this.isSubmitting = false;
            // Remove the deleted item from the list
            this.items = this.items.filter(item => item.sno !== this.editItem.sno);

            // Close the dialog if open
            this.displayEditDialog = false;
          },
          (error) => {
            // Handle error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `An error occurred while deleting the ${this.context.label}.`,
              life: 3000,
            });
            this.isSubmitting = false;
            console.error(`Error deleting ${this.context.label}:`, error);
          }
        );
      }
    });
  }


  // Clear search input
  clearSearch(): void {
    this.searchTerm = '';
  }


  // Define the clearSelection method to clear the selected value
  clearSelection(): void {
    this.selectedItem = null;  // Set the selectedItem to null to clear the selection
  }
}
