import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService, SelectItem } from 'primeng/api'; // For dropdown options
import { FormsModule } from '@angular/forms';  // For ngModel binding
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { OvertimeserviceService } from '../../services/overtimeservice.service';
import { HttpClient } from '@angular/common/http';
import { HolidayService } from '../../services/holiday.service';
import { CheckboxModule } from 'primeng/checkbox';

interface OvertimeItem {
  sno: number;
  overtimeName: string; // Changed from 'string | null' to required string
  minimumOtHours: number; // Changed property name from minimumOTHours
  overtimeFor: string; // Remains the same
  workingHoursPerMonth: number; // Remains the same
  roundOff: string; // Changed property name from roundOffOption
  overtimeApplicableStatus: boolean; // Added new property
  overtimeType: string; // Remains the same
}


@Component({
  selector: 'app-overtime-modal',
  templateUrl: './overtime-modal.component.html',
  styleUrl: './overtime-modal.component.scss',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    InputNumberModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    CheckboxModule
  ],
  providers: [MessageService]
})
// Define an interface for your items (modify as per your data structure)


// Update your component
export class OvertimeModalComponent {
  constructor(private overtimeService: OvertimeserviceService, private http: HttpClient, private messageService: MessageService,
    private holidayService: HolidayService,
  ) { }

  // Ensure your items are typed
  sno: number | null = null;
  overtimeType: string = '';
  minimumOTHours: number = 0;
  overtimeFor: string = '';
  negativeOT: string | null = null;
  workingHoursPerMonth: number = 0;
  roundOffOption: string = '';
  isDialogVisible: boolean = false;
  ruleType: string = '';
  isNewItemFlag: boolean = false;
  nextSerialNumber: number = 0;
  overtime: string = '';
  overtimeApplicableStatus: boolean = false;

  // Dropdown options
  OvertimeTypes: SelectItem[] = [
    { label: 'Working Day', value: 'working' },
    { label: 'Non working-Day', value: 'NonWorking' },
    { label: 'Both', value: 'casual' },
  ];

  OverTimeFor: SelectItem[] = [
    { label: 'None', value: 'none' },
    { label: 'EarlyIn', value: 'EarlyIn' },
    { label: 'LateOut', value: 'LateOut' },
    { label: 'Both', value: 'Both' },
  ];

  NegativeOT: SelectItem[] = [
    { label: 'None', value: 'none' },
    { label: 'EarlyOut', value: 'EarlyOut' },
    { label: 'LateOut', value: 'LateOut' },
    { label: 'Both', value: 'Both' },
  ];

  RoundOffOption: SelectItem[] = [
    { label: 'None', value: 'none' },
    { label: 'Upper', value: 'upper' },
    { label: 'Lower', value: 'lower' },
    { label: 'Actual', value: 'actual' },
  ];

  async OvertimeDialog(ruleType: string, selectedItem?: number | null): Promise<void> {
    console.log('Opening Dialog for Rule Type:', ruleType, 'Selected Item:', selectedItem);
    this.ruleType = ruleType;
    this.isNewItemFlag = !selectedItem; // Flag to indicate if it's a new item

    const resetDialogFields = () => {
      this.sno = null;
      this.overtime = '';
      this.overtimeType = '';
      this.minimumOTHours = 0;
      this.overtimeFor = '';
      this.negativeOT = null;
      this.workingHoursPerMonth = 0;
      this.roundOffOption = '';
      this.overtimeApplicableStatus = false;
    };

    try {
      // Load items if needed

      if (selectedItem) {
        // Load existing item data for editing
        const matchedItem = this.items.find((item: OvertimeItem) => item.sno === selectedItem);
        if (matchedItem) {
          this.sno = matchedItem.sno;
          this.overtime = matchedItem.overtimeName;
          this.overtimeType = matchedItem.overtimeType;
          this.minimumOTHours = matchedItem.minimumOtHours;
          this.overtimeFor = matchedItem.overtimeFor;

          this.workingHoursPerMonth = matchedItem.workingHoursPerMonth;
          this.roundOffOption = matchedItem.roundOff;
          this.overtimeApplicableStatus = matchedItem.overtimeApplicableStatus;

          console.log('Loaded item for editing:', matchedItem);
        } else {
          console.warn('No matching item found for sno:', selectedItem);
          resetDialogFields(); // Reset if no match is found
        }
      } else {
        // Prepare fields for a new item
        // Fetch next serial number
        resetDialogFields(); // Reset fields
        this.sno = this.nextSerialNumber;
        console.log('Initialized fields for new item. Next Serial Number:', this.sno);
      }

      this.isDialogVisible = true; // Open the dialog
    } catch (error) {
      console.error('Error opening dialog:', error);
    }
  }

  items: OvertimeItem[] = []; // Overtime items from the API
  selectedItem: number | null = null; // Selected SNO in dropdown

  // Example: Set selectedItem when an item is selected from the UI
  // Assume 'overtime' is the selected item


  ngOnInit(): void {
    this.loadOvertimeItems();
    this.holidayService.refresh$.subscribe(() => {
      this.loadOvertimeItems(); // Reload the data when notified
    });
  }

  // Fetch data from the API
  loadOvertimeItems(): void {
    this.overtimeService.getOvertimeItems().subscribe({
      next: (data) => {
        this.items = data;
        console.log('Overtime data loaded:', this.items);
      },
      error: (error) => {
        console.error('Error fetching overtime data:', error);
      },
    });
  }

  // Map API data to dropdown format
  filteredItems(): { label: string; value: number }[] {
    // Add this for debugging
    return this.items.map((item) => ({
      label: item.overtimeName,
      value: item.sno,
    }));
  }



  isSubmitting = false;
  saveOvertime(event: Event): void {
    event.preventDefault();
    this.isSubmitting = true;

    // Prepare the overtime data
    const overtimeData: OvertimeItem = {
      sno: this.selectedItem ? this.selectedItem : 0,  // Use selectedItem if present, else 0
      overtimeName: this.overtime,
      minimumOtHours: this.minimumOTHours,
      overtimeFor: this.overtimeFor,
      workingHoursPerMonth: this.workingHoursPerMonth,
      roundOff: this.roundOffOption,
      overtimeApplicableStatus: this.overtimeApplicableStatus,
      overtimeType: this.overtimeType,
    };

    console.log('Saving overtime data:', overtimeData);

    // Call the service to save the overtime data
    this.overtimeService.saveOvertime(overtimeData).subscribe({
      next: (response) => {
        console.log('Overtime data saved successfully:', response);

        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.selectedItem
            ? 'Overtime data updated successfully.'
            : 'Overtime data saved successfully.',
        });
        this.isSubmitting = false;
        this.holidayService.triggerRefresh();
        // Reset or update the UI after saving the data
        this.isDialogVisible = false;
      },
      error: (error) => {
        console.error('Error saving overtime data:', error);

        // Show error message
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error saving overtime data.',
        });
        this.isSubmitting = false;
      },
    });
  }

  hideDilaog() {
    this.isDialogVisible = false;
  }
  // Reset method to clear the form fields (optional)
  resetDialogFields(): void {
    this.sno = null;
    this.overtime = '';
    this.overtimeType = '';
    this.minimumOTHours = 0;
    this.overtimeFor = '';
    this.negativeOT = null;
    this.workingHoursPerMonth = 0;
    this.roundOffOption = '';
  }
  deleteOvertime(event: Event): void {
    event.preventDefault();
    this.isSubmitting = true;
    if (this.selectedItem !== null) {  // Check if the selectedItem is not null
      // Ensure selectedItem is a valid number
      const sno = this.selectedItem as number;

      // Show confirmation dialog before proceeding
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete the overtime with serial number ${sno}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Show loading message before starting the deletion
          this.messageService.add({ severity: 'info', summary: 'Deleting...', detail: 'Deleting overtime data...' });
          this.isSubmitting = true;

          // Proceed with deletion
          this.overtimeService.deleteOvertime(sno).subscribe({
            next: (response) => {
              console.log('Overtime data deleted successfully:', response);
              // Show success message after deletion
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Overtime data deleted successfully.' });

              this.holidayService.triggerRefresh();
              this.isSubmitting = false;
              this.isDialogVisible = false;
              // Optionally refresh the list after deletion
              this.loadOvertimeItems();  // If you have a method to reload the items from the API
            },
            error: (error) => {
              console.error('Error deleting overtime data:', error);
              // Show error message if deletion fails
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There was an error deleting overtime data.' });
              this.isSubmitting = false;
            }
          });
        }
      });
    } else {
      console.warn('No item selected for deletion');
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select an item to delete.' });
    }
  }
  clearSelection() {
    this.selectedItem = null; // Clears the selected value
  }


}