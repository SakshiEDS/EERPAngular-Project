
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
// import { EmployeeData } from './employe-detail-modal';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { ModalService } from '../../modal.service';
import { LateoutService } from '../../services/lateout.service';
import { firstValueFrom } from 'rxjs';
import { HolidayService } from '../../services/holiday.service';
@Component({
  selector: 'app-lateandout',
  templateUrl: './lateandout.component.html',
  styleUrl: './lateandout.component.scss',
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
    LateandoutComponent

  ],
})
export class LateandoutComponent {

  @Output() dataSaved = new EventEmitter<void>();
  items: any[] = [];

  activeStatus: boolean = false;
  sno: number | undefined;


  isDialogVisible: boolean = false; // Dialog visibility state

  // openDialog(): void {
  //   this.isDialogVisible = true; // Show the dialog when called
  // }
  @Input() ruleType: string = '';

  closeDialog(): void {
    this.isDialogVisible = false; // Optional method to close the dialog programmatically
  }


  nextSerialNumber: number = 0;
  name: string = '';
  slab1: number = 0;
  slab2: number = 0;
  slab3: number = 0;
  slab4: number = 0;
  points1: number = 0;
  points2: number = 0;
  points3: number = 0;
  points4: number = 0;
  monthlyAllowedPoints: number = 0;
  onDayDeductionPoints: number = 0;
  isNewItemFlag: boolean = false;

  constructor(private lateInRuleService: LateoutService,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
    private holidayService: HolidayService,
  ) { }

  ngOnInit() {
    // this.loadItems();
    this.getNextSerialNumber(); // Initialize serial number based on default rule type
  }


  async loadItems(): Promise<void> {
    try {
      if (this.ruleType === 'earlyOut') {
        this.items = (await firstValueFrom(this.lateInRuleService.getItems())) || [];
        console.log('EarlyOut Items loaded:', this.items);
      } else if (this.ruleType === 'lateIn') {
        this.items = (await firstValueFrom(this.lateInRuleService.getLateInItems())) || [];
        console.log('LateIn Items loaded:', this.items);
      }
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error loading items:', error);
      this.items = []; // Assign an empty array in case of an error
    }
  }

  async openDialog(ruleType: string, selectedItem?: any): Promise<void> {
    console.log('Opening Dialog for Rule Type:', ruleType, 'Selected Item:', selectedItem);

    this.ruleType = ruleType;
    this.isNewItemFlag = !selectedItem;

    const resetDialogFields = () => {
      this.slab1 = 0;
      this.slab2 = 0;
      this.slab3 = 0;
      this.slab4 = 0;
      this.points1 = 0;
      this.points2 = 0;
      this.points3 = 0;
      this.points4 = 0;
      this.monthlyAllowedPoints = 0;
      this.onDayDeductionPoints = 0;
      this.name = '';
      this.activeStatus = false;
    };

    try {
      await this.loadItems(); // Load items based on rule type

      if (selectedItem) {
        // If a selected item is provided, prepopulate the dialog
        const matchedItem = this.items.find((item) => item.sno === selectedItem);
        if (matchedItem) {
          console.log('Matched Item:', matchedItem);

          this.sno = matchedItem.sno || 0;
          this.slab1 = matchedItem.slab1 ?? 0;
          this.slab2 = matchedItem.slab2 ?? 0;
          this.slab3 = matchedItem.slab3 ?? 0;
          this.slab4 = matchedItem.slab4 ?? 0;
          this.points1 = matchedItem.points1 ?? 0;
          this.points2 = matchedItem.points2 ?? 0;
          this.points3 = matchedItem.points3 ?? 0;
          this.points4 = matchedItem.points4 ?? 0;
          this.monthlyAllowedPoints = matchedItem.monthlyAllowedPoints ?? 0;
          this.onDayDeductionPoints = matchedItem.onDayDeductionPoints ?? 0;
          this.name = matchedItem.name ?? '';
          this.activeStatus = matchedItem.activeStatus ?? false;

          console.log('After assignment:', this.sno, this.slab1, this.name);
        } else {
          console.warn('No matching item found for sno:', selectedItem);
          resetDialogFields(); // Reset fields if no match is found
        }
      } else {
        // Fetch next serial number for a new entity
        try {
          await this.getNextSerialNumber();
          resetDialogFields();
          this.sno = this.nextSerialNumber; // Set fetched serial number
          console.log('Next Serial Number for new entity:', this.sno);
        } catch (error) {
          console.error('Error fetching next serial number:', error);
        }
      }

      // Open the dialog
      this.isDialogVisible = true;
    } catch (error) {
      console.error('Error opening dialog:', error);
    }
  }



  // Handle Rule Type change
  onRuleTypeChange(ruleType: string) {
    this.ruleType = ruleType;
    // this.loadItems(); // Reload the items based on the new rule type
    this.getNextSerialNumber(); // Fetch next serial number based on selected rule
  }

  // ngOnChanges(): void {
  //   this.loadItems();

  // }


  // Fetch the next serial number based on rule type
  getNextSerialNumber(): Promise<number> {
    return new Promise((resolve, reject) => {
      let apiCall;

      // Determine the API call based on ruleType
      if (this.ruleType === 'lateIn') {
        apiCall = this.lateInRuleService.getNextSerialNumberLateIn();
      } else if (this.ruleType === 'earlyOut') {
        apiCall = this.lateInRuleService.getNextSerialNumberEarlyOut();
      } else {
        const errorMessage = `Invalid rule type: ${this.ruleType}`;
        // console.error(errorMessage);
        reject(errorMessage);
        return;
      }

      // Make the API call and handle response
      apiCall.subscribe(
        (serialNumber) => {
          this.nextSerialNumber = serialNumber;
          resolve(serialNumber); // Resolve with the fetched serial number
        },
        (error) => {
          console.error(`Error fetching serial number for ${this.ruleType} rule`, error);
          reject(error); // Reject with the error
        }
      );
    });
  }

  isSubmitting = false;
  // Save data to either LateInRule or EarlyOutRule API
  async saveData(): Promise<void> {


    this.isSubmitting = true;

    if (!this.name || this.name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Name is required.',
      });
      this.isSubmitting = false;
      return; // Exit if name is not provided
    }
    const data = {
      sno: this.sno,
      name: this.name,
      slab1: this.slab1,
      slab2: this.slab2,
      slab3: this.slab3,
      slab4: this.slab4,
      points1: this.points1,
      points2: this.points2,
      points3: this.points3,
      points4: this.points4,
      monthlyAllowedPoints: this.monthlyAllowedPoints,
      onDayDeductionPoints: this.onDayDeductionPoints,
      activeStatus: this.activeStatus,
    };

    let requestObservable;

    if (this.sno && !this.isNewItemFlag) {
      if (this.ruleType === 'lateIn') {
        requestObservable = this.lateInRuleService.updateLateInRule(this.sno, data);
      } else if (this.ruleType === 'earlyOut') {
        requestObservable = this.lateInRuleService.updateEarlyOutRule(this.sno, data);
      }
    } else {
      if (this.ruleType === 'lateIn') {
        requestObservable = this.lateInRuleService.saveLateInRule(data);
      } else if (this.ruleType === 'earlyOut') {
        requestObservable = this.lateInRuleService.saveEarlyOutRule(data);
      }
    }

    if (requestObservable) {
      requestObservable.subscribe(
        async (response) => {
          console.log('Data saved/updated successfully:', response);
          this.dataSaved.emit(response);

          // Show success message
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Data ${this.sno && !this.isNewItemFlag ? 'updated' : 'saved'} successfully.`,
          });
          this.isSubmitting = false;
          this.holidayService.triggerRefresh();
          // Reload the data and update the selected item in the dropdown
          // await this.loadItems();  // Refresh items list

          // Optionally, reset or reselect selected item based on context


          this.isDialogVisible = false;
        },
        (error) => {
          console.error('Error saving/updating data:', error);

          // Show error message
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.sno && !this.isNewItemFlag ? 'update' : 'save'} data.`,
          });
          this.isSubmitting = false;
        }
      );
    }
  }

  async deleteItem(sno: number): Promise<void> {
    this.isSubmitting = true;

    if (!this.name || this.name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Name is required before deleting the item.',
      });
      this.isSubmitting = false;
      return; // Exit if name is not provided
    }
    try {
      const confirmDelete = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });

      if (confirmDelete.isConfirmed) {
        let deleteRequest;

        // Determine which rule type to delete
        if (this.ruleType === 'lateIn') {
          deleteRequest = this.lateInRuleService.deleteLateInRule(sno);
        } else if (this.ruleType === 'earlyOut') {
          deleteRequest = this.lateInRuleService.deleteEarlyOutRule(sno);
        }

        // Make the API call to delete
        if (deleteRequest) {
          deleteRequest.subscribe(
            async (response) => {
              console.log('Item deleted successfully:', response);

              // Show success message
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Item deleted successfully.',
              });
              this.isSubmitting = false;

              // Reload items to reflect changes
              this.holidayService.triggerRefresh();

              // Trigger change detection to update the UI
              this.cdRef.detectChanges();
              this.isDialogVisible = false;
            },
            (error) => {
              console.error('Error deleting item:', error);

              // Show error message
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete item.',
              });
              this.isSubmitting = false;
            }
          );
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

}
