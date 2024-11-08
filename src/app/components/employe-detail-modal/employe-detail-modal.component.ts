import { Component } from '@angular/core';
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

@Component({
  selector: 'app-employe-detail-modal',
  templateUrl: './employe-detail-modal.component.html',
  styleUrls: ['./employe-detail-modal.component.scss'],
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
    CommonModule
  ]
})
export class EmployeDetailModalComponent {
  // Visibility of the modal dialog
  visible: boolean = false;
  isBasicInfoCollapsed: boolean = false;
  isAddInfoCollapsed: boolean = false;
  isOffInfoCollapsed: boolean = false;
  isEsiInfoCollapsed: boolean = false;
  isBankInfoCollapsed: boolean = false;
  isQualificationCollapsed: boolean = false;
  isExperienceCollapsed: boolean = false;
  isLeavePolicyCollapsed: boolean = false;
  isPostInfoCollapsed: boolean = false;
  isSalaryStructureCollapsed: boolean = false;
  isCollapsed: boolean = false;
  esiApplication: boolean = false;
  pfApplication: boolean = false;
  profTaxApplicable: boolean = false;
  lwfApplicable: boolean = false;
  overtimeApplicable: boolean = false;
  qualificationData: any[] = [
    {
      degree: 'Degree',
      passingYear: 'Passing Year',
      institute: 'Institute/Board/University',
      score: 'Score'
    }
  ];

  addQualificationRow() {
    // Add a new row to the qualificationData array
    this.qualificationData.push({
      degree: '',
      passingYear: '',
      institute: '',
      score: ''
    });
  }

  experienceData: any[] = [];

  // Define the model for a single experience item (optional, for better type safety)
  experience: any = {
    companyName: '',
    designation: '',
    place: '',
    fromDate: '',
    toDate: '',
    year: null,
    month: null,
    reasonForLeaving: ''
  };

  // Method to add a new row to the experience table
  addExperienceRow() {
    // Push a new row with empty values to the experienceData array
    this.experienceData.push({
      companyName: '',
      designation: '',
      place: '',
      fromDate: '',
      toDate: '',
      year: null,
      month: null,
      reasonForLeaving: ''
    });
  }

  leaveData: any[] = [
    { name: 'Casual Leave', applicable: false },
    { name: 'Earned Leave', applicable: false },
    { name: 'EL', applicable: false },
    { name: 'Medical Leave', applicable: false },
    { name: 'Unpaid Leave', applicable: false }
  ];
  salaryData: any[] = [
    { description: 'Basic', alias: 'B', amount: 0 },
    { description: 'CTC', alias: '', amount: 0 },
    { description: 'TDS', alias: '', amount: 0 },
    { description: 'In Hand', alias: '', amount: 0 }
  ];

  // Variables for storing form data
  name: string = '';
  mappingCode: string = '000002';
  fatherName: string = '';
  motherName: string = '';
  maritalStatusOptions: SelectItem[] = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' }
  ];
  selectedMaritalStatus: string = '';
  spouseName: string = '';
  anniversaryDate: Date | null = null;
  religion: string = '';
  dob: Date | null = null;
  genderOptions: SelectItem[] = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];
  selectedGender: string = '';
  sexOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];
  bloodGroupOptions: SelectItem[] = [
    { label: 'A+', value: 'A+' },
    { label: 'O+', value: 'O+' },
    { label: 'B+', value: 'B+' }
  ];
  selectedBloodGroup: string = '';
  nationality: string = '';
  cardNo: string = '000002';
  temporaryAddress: string = '';
  permanentAddress: string = '';
  profilePicture: File | null = null;

  // Country, state, and city options
  countries: SelectItem[] = [
    { label: 'India', value: 'India' },
    { label: 'USA', value: 'USA' },
    { label: 'Canada', value: 'Canada' }
  ];
  states: SelectItem[] = [
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'California', value: 'California' },
    { label: 'Ontario', value: 'Ontario' }
  ];
  cities: SelectItem[] = [
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'San Francisco', value: 'San Francisco' },
    { label: 'Toronto', value: 'Toronto' }
  ];

  // Method to show the dialog
  showDialog() {
    this.visible = true;
  }

  // Method to hide the dialog
  hideDialog() {
    this.visible = false;
  }

  // Method to handle saving the data
  onSave() {
    console.log('Employee details saved!');
    this.hideDialog(); // Close the modal after saving
  }

  // Method to clear the form
  onClear() {
    this.name = '';
    this.fatherName = '';
    this.motherName = '';
    this.selectedMaritalStatus = '';
    this.spouseName = '';
    this.anniversaryDate = null;
    this.religion = '';
    this.dob = null;
    this.selectedGender = '';
    this.selectedBloodGroup = '';
    this.nationality = '';
    this.permanentAddress = '';
    this.temporaryAddress = '';
    this.profilePicture = null;
    console.log('Form cleared!');
  }

  // Method to print the form data (just a placeholder here)
  onPrint() {
    console.log('Printing employee details!');
  }

  // Method to delete the employee record (just a placeholder here)
  onDelete() {
    console.log('Employee record deleted!');
    this.hideDialog(); // Close the modal after deleting
  }

  // Method to exit the modal without saving
  onExit() {
    console.log('Exiting the modal!');
    this.hideDialog(); // Close the modal on exit
  }

  // Method to copy temporary address to permanent address
  copyTemporaryAddress() {
    this.permanentAddress = this.temporaryAddress;
    console.log('Temporary address copied to permanent address!');
  }

  // Method to handle the file upload event
  onFileUpload(event: any) {
    this.profilePicture = event.files[0]; // Store the uploaded file
    console.log('Profile picture uploaded!', this.profilePicture);
  }
}
