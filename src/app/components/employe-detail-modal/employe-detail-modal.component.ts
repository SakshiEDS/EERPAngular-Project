import { Component, OnInit } from '@angular/core';
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
import { ApiService } from '../../api.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { EmployeeData } from './employe-detail-modal';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
interface DateInfo {
  year: number;
  month: number;
  day: number;
  dayOfWeek?: number;
}




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
    CommonModule,
    ReactiveFormsModule,
    ToastModule

  ],
  providers: [MessageService]

})
export class EmployeDetailModalComponent implements OnInit {
  visible: boolean = false;
  employeeForm!: FormGroup;
  employeeData: any;

  displayEditDialog: boolean = false;
  displayAdditionalDialog: boolean = false;
  editEmpName: string = '';
  editEmpCode: string = '';
  additionalInfo: string = '';

  showEditDialog() {
    // Set initial values if needed
    this.editEmpName = 'Current Employee Name'; // Replace with actual value
    this.editEmpCode = 'Current Employee Code'; // Replace with actual value
    this.displayEditDialog = true;
  }

  saveEmployeeDetails() {
    // Save action for the main dialog
    console.log("Name:", this.editEmpName);
    console.log("Code:", this.editEmpCode);
    this.displayEditDialog = false; // Close main dialog after saving
  }

  showAdditionalDialog() {
    // Open the additional info dialog
    this.displayAdditionalDialog = true;
  }

  saveAdditionalInfo() {
    // Save action for the additional dialog
    console.log("Additional Info:", this.additionalInfo);
    this.displayAdditionalDialog = false; // Close additional dialog after saving
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService // Inject MessageService
  ) { }

  // constructor(private http: HttpClient, private messageService: MessageService) { }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      empDetail: this.fb.group({
        sno: [0],
        empCode: [],
        empName: [''],
        empImage: [''],
        empFatherName: [''],
        empMotherName: [''],
        empMartialStatus: [''],
        empSpouseName: [''],
        empAnniversaryDate: [''],
        empReligion: [''],
        empDateOfBirth: [''],
        empSex: [''],
        empBloodGroup: [''],
        empNationlity: [''],
        empCardNo: [],
        empEmergencyName: [''],
        empEmergencyRelation: [''],
        empEmergencyPhoneNo: [],
        empEmergencyEmail: [''],
        empLogin: [true],
        empInTime: ['09:30:00'],
        empOutTime: ['18:00:00'],
        empReportingTo: [''],
        empShift: [''],
        empDesignation: [],
        empDepartment: []
      }),
      empBankDetail: this.fb.group({
        sno: [0],
        empCode: [],
        empBankCode: [],
        empBankName: [''],
        empBranch: [''],
        empBankAccount: [],
        empIfsccode: [''],
        empAccountHolderName: ['']
      }),
      empAttachment: this.fb.group({
        sno: [0],
        empCode: [],
        empAttachedNo: [''],
        empAttachedDocumentName: [''],
        empAttachedDocument: ['']
      }),
      empLeaveDetail: this.fb.group({
        sno: [0],
        empCode: [],
        empLeavesType: [''],
        empLeavesAllot: ['']
      }),
      empOfficialInformation: this.fb.group({
        sno: [0],
        empCode: [],
        empCityType: [''],
        empJoiningDate: [''],
        empConfirmationDate: [''],
        empProbationMonth: [],
        empNoitceDays: [],
        empSalaryWages: [''],
        empPan: [''],
        empUanno: [],
        empVoterCardNo: [''],
        empAadharCardNo: [],
        empPassportNo: [''],
        empPassportValidDate: [''],
        empDlno: [''],
        empDlvalidDate: ['']
      }),
      empPostingAttachment: this.fb.group({
        sno: [0],
        empCode: [],
        empDepartmentCode: [],
        empDesignationCode: [],
        empDepartment: [''],
        empDesignation: ['']
      }),
      empQualificationExperience: this.fb.group({
        sno: [0],
        empCode: [],
        empQualification: [''],
        empPassingYear: [],
        empInstitute: [''],
        empScore: [''],
        empExpCompany: [''],
        empExpDesignation: [''],
        empExpPlace: [''],
        empExpFromDate: [''],
        empExpToDate: [''],
        empExpYear: [],
        empExpMonth: [],
        empExpReasonLeaving: ['']
      })
    });

  }

  // ngOnInit(): void {
  //   // Optionally, you can fetch data on component initialization
  //   // this.getEmployeeData(55); // Call the method to fetch data for a specific employee
  // }
  // getEmployeeData(employeeId: number): void {
  //   const url = `http://13.233.79.234/eERPapi/api/EmpDetails/${employeeId}`;

  //   this.http.get(url).subscribe({
  //     next: (response: any) => {
  //       // Store the response in the employeeData variable
  //       this.employeeData = response;
  //       // Display success message using PrimeNG toast
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Data Fetched',
  //         detail: 'Employee data fetched successfully!',
  //         life: 3000 // Display duration in milliseconds
  //       });
  //       console.log('Employee Data:', response); // Log the response in the console
  //     },
  //     error: (error) => {
  //       // Show an error message if the API call fails
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error Fetching Data',
  //         detail: 'An error occurred while fetching the employee data.',
  //         life: 3000
  //       });
  //       console.error('Error fetching employee data:', error); // Log the error
  //     }
  //   });
  // }

  // populateForm(data: any): void {
  //   // Populate the form with data from the API response
  //   this.employeeForm.patchValue({
  //     empDetail: {
  //       sno: data.sno,
  //       empCode: data.empCode,
  //       empName: data.empName,
  //       empImage: data.empImage,
  //       empFatherName: data.empFatherName,
  //       empMotherName: data.empMotherName,
  //       empMartialStatus: data.empMartialStatus,
  //       empSpouseName: data.empSpouseName,
  //       empAnniversaryDate: data.empAnniversaryDate,
  //       empReligion: data.empReligion,
  //       empDateOfBirth: data.empDateOfBirth,
  //       empSex: data.empSex,
  //       empBloodGroup: data.empBloodGroup,
  //       empNationlity: data.empNationlity,
  //       empCardNo: data.empCardNo,
  //       empEmergencyName: data.empEmergencyName,
  //       empEmergencyRelation: data.empEmergencyRelation,
  //       empEmergencyPhoneNo: data.empEmergencyPhoneNo,
  //       empEmergencyEmail: data.empEmergencyEmail,
  //       empLogin: data.empLogin,
  //       empInTime: data.empInTime,
  //       empOutTime: data.empOutTime,
  //       empReportingTo: data.empReportingTo,
  //       empShift: data.empShift,
  //       empDesignation: data.empDesignation,
  //       empDepartment: data.empDepartment
  //     }
  //   });
  // }
  onSubmit(): void {
    const employeeData: EmployeeData = this.employeeForm.value;

    this.http.post('https://localhost:7238/api/EmpDetails', employeeData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data posted successfully!',
          life: 3000 // Display duration in milliseconds
        });
        console.log('Data posted successfully:', response);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while posting data.',
          life: 3000
        });
        console.error('Error posting data:', error);
      }
    });


  }


  // Visibility of the modal dialog

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
