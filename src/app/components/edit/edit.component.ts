import { Component, OnInit, Input, ViewChild, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectItem } from 'primeng/api'; // For dropdown options
import { FileUpload } from 'primeng/fileupload'; // If using file upload
import { FormArray, FormsModule, Validators } from '@angular/forms';  // To support ngModel binding
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
import { DynamicComponent } from '../dynamic/dynamic.component';
import { EmployeeService } from '../../services/employee.service';
import { map, Observable } from 'rxjs';
import { LateandoutComponent } from '../lateandout/lateandout.component';
import { LeaveMasterService } from '../../services/leave-master.service';
import { HolidayService } from '../../services/holiday.service';
import { OvertimeModalComponent } from "../overtime-modal/overtime-modal.component";

interface DateInfo {
  year: number;
  month: number;
  day: number;
  dayOfWeek?: number;
}
export interface EmployeeData {
  empDetail: {
    sno: number;
    empCode: number;
    empName: string;

    empFatherName: string;
    empMotherName: string;
    empMartialStatus: string;
    empSpouseName: string;
    empAnniversaryDate: string;
    empReligion: string;
    empMobileNo: number;
    empMail: string;
    empDateOfBirth: string;
    empSex: string;
    empBloodGroup: string;
    empNationlity: string;
    empCardNo: number;
    empEmergencyName: string;
    empEmergencyRelation: string;
    empEmergencyPhoneNo: number;
    empEmergencyEmail: string;
    empLogin: boolean;

  };
  empBankDetail: {
    sno: number;
    empCode: number;
    empBankCode: number;
    empBankName: string;
    empBranch: string;
    empBankAccount: number;
    empIfsccode: string;
    empAccountHolderName: string;
  };
  // empAttachment: {
  //     sno: number;
  //     empCode: number;

  //     empAttachedDocumentName: string;
  //     empAttachedDocumentPath: string;
  // };
  empAllotedLeaves: {
    sno: number;
    empCode: number;
    empLeavesCode: number;
    empLeavesEffectiveDate: string;
    isPermitted: boolean;
  }[];
  empOfficialInformation: {
    sno: number;
    empCode: number;
    empCityType: string;
    empJoiningDate: string;
    empConfirmationDate: string;
    empProbationMonth: number;
    empNoitceDays: number;
    empSalaryWages: string;
    empPan: string;
    empUanno: number;
    empVoterCardNo: string;
    empAadharCardNo: number;
    empPassportNo: string;
    empPassportValidDate: string;
    empDlno: string;
    empDlvalidDate: string;
  };
  empPostingAttachment: {
    sno: number;
    empCode: number;
    empDepartmentCode: number;
    empDesignationCode: number;
    empReportingTo: number;
    empShift: number;
    empEffectiveDate: string;
    empOvertimeId: number;




  };
  empQualificationExperience: {
    sno: number;
    empCode: number;
    empQualification: string;
    empPassingYear: number;
    empInstitute: string;
    empScore: string;
    empExpCompany: string;
    empExpDesignation: string;
    empExpPlace: string;
    empExpFromDate: string;
    empExpToDate: string;
    empExpYear: number;
    empExpMonth: number;
    empExpReasonLeaving: string;
  }[];
  empAddress: {
    sno: number;
    empCode: number;
    empTempAddr: string;
    empTempCountry: number;
    empTempState: number;
    empTempCity: number | number;
    empTempPinCode: string | number;
    empTempPhoneNo: string | number;
    empTempLongitude: string;
    empTempLatitude: string;
    empPermAddr: string;
    empPermCountry: number;
    empPermState: number;
    empPermCity: number;
    empPermPinCode: string | number;
    empPermPhoneNo: string | number;
    empPermLongitude: string;
    empPermLatitude: string;
  };






}




@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
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
    DynamicComponent,
    LateandoutComponent, OvertimeModalComponent],
  providers: [MessageService]

})

export class EditComponent implements OnInit {
  employeeForm!: FormGroup;

  @Input() visible: boolean = false;  // Bind the visibility to parent component
  @Input() employeeData: any;         // Employee data passed from parent component
  @Output() close = new EventEmitter<void>();
  @Input() isEditModal: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && !changes['visible'].firstChange) {
      // Handle visibility changes if needed
    }
  }

  closeModal() {
    this.close.emit();  // Emit the close event to parent component
  }
  displayModal: boolean = false; // for main dialog visibility
  displayEditDialog: boolean = false; // for edit dialog visibility
  empName: string = ''; // Bind this to the input field for Name
  searchTerm: string = ""; // Search term for filtering items
  city: any = { code: '', name: '', underState: '' }; // City data for editing
  items: any[] = [
    { id: '0001', name: 'Default' },
    { id: '0002', name: 'Faridabad' },
    { id: '0003', name: 'New Delhi' },
    { id: '0004', name: 'New Delhi2' },

  ];


  trackById(index: number, item: any) {
    return item.id;
  }

  // Method to clear the search input
  clearSearch() {
    this.searchTerm = "";
  }

  deleteQualificationRow(index: number) {
    // Remove the row from the qualificationData array based on its index
    this.qualificationData.splice(index, 1);
  }

  deleteExperienceRow(index: number) {
    // Remove the row from the experienceData array based on its index
    this.experienceData.splice(index, 1);
  }

  // Method to filter items based on the search term
  filteredItems() {
    if (!this.searchTerm) {
      console.log("Filtered Items:", this.items);  // Verify full items list
      return this.items;
    }
    return this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // cities: { id: string; name: string }[] = []; // Define the type explicitly
  // selectedCity: { id: string; name: string } | null = null; // Allow null for initial state
  displayCityDialog: boolean = false; // Control visibility of DynamicComponent

  // Show the city dialog
  showCityDialog() {
    this.displayCityDialog = true;
  }

  // Handle selected city from DynamicComponent
  selectedCity: any;
  cities: SelectItem[] = [];

  onCitySelected(city: any): void {
    this.selectedCity = { label: city.name, value: city.sno }; // Match dropdown format
  }
  displayAdditionalDialog: boolean = false;
  editEmpName: string = '';
  editEmpCode: string = '';
  additionalInfo: string = '';



  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private modalService: ModalService,
    private leaveService: LeaveMasterService,
    private holidayService: HolidayService // Inject MessageService
  ) { }

  employees: EmployeeData[] = [];
  selectedEmployeeCode: number | null = null;
  empLeaveDetails: any[] = [];
  leaveTypes: any[] = [];
  empCode: number = 105;

  ngOnInit(): void {
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) {
      this.imagePreview = storedImage;
    }

    this.employeeForm = this.fb.group({
      empDetail: this.fb.group({
        sno: [0],
        empCode: [],
        empName: [''],

        empFatherName: [''],
        empMotherName: [''],
        empMartialStatus: [''],
        empSpouseName: [null], // Allows null
        empAnniversaryDate: [null],
        empReligion: [''],
        empDateOfBirth: [''],
        empMobileNo: [],
        empMail: [''],
        empSex: [''],
        empBloodGroup: [''],
        empNationlity: [''],
        empCardNo: [],
        empEmergencyName: [''],
        empEmergencyRelation: [''],
        empEmergencyPhoneNo: [],
        empEmergencyEmail: [''],
        empLogin: [true],

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
      // empAttachment: this.fb.array([]),
      empAllotedLeaves: this.fb.array([]),
      empAddress: this.fb.group({
        sno: [],
        empCode: [],
        empTempAddr: [],
        empTempCountry: [],
        empTempState: [],
        empTempCity: [],
        empTempPinCode: [],
        empTempPhoneNo: [],
        empTempLongitude: [''],
        empTempLatitude: [''],
        empPermAddr: [''],
        empPermCountry: [],
        empPermState: [],
        empPermCity: [],
        empPermPinCode: [],
        empPermPhoneNo: [],
        empPermLongitude: [''],
        empPermLatitude: [''],
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
        empReportingTo: [],
        empShift: [],
        empEffectiveDate: [''],
        empOvertimeId: [2]


      }),
      empQualificationExperience: this.fb.group({
        qualifications: this.fb.array([]),
        experiences: this.fb.array([]),
      }),



    });
    // this.addQualificationRow();
    // this.addExperienceRow();


    this.loadLeaveTypes();

  }

  imagePreview: string | null = null;

  // Trigger file input click event
  triggerFileInput() {
    document.getElementById('imageUpload')?.click();
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        // Store the image as a base64 string in localStorage
        localStorage.setItem('uploadedImage', reader.result as string);

        // Set the preview image
        this.imagePreview = reader.result as string;
      };

      // Read the image file as a data URL (base64)
      reader.readAsDataURL(file);
    }
  }
  get qualifications(): FormArray {
    return (this.employeeForm.get('empQualificationExperience') as FormGroup).get(
      'qualifications'
    ) as FormArray;
  }

  get experiences(): FormArray {
    return (this.employeeForm.get('empQualificationExperience') as FormGroup).get(
      'experiences'
    ) as FormArray;
  }

  // Add a qualification row
  addQualificationRow(): void {
    this.qualifications.push(
      this.fb.group({
        sno: ['', Validators.required],
        empCode: ['', Validators.required],
        empQualification: ['', Validators.required],
        empPassingYear: ['', Validators.required],
        empInstitute: ['', Validators.required],
        empScore: ['', Validators.required],
      })
    );
  }

  // Add an experience row
  addExperienceRow(): void {
    this.experiences.push(
      this.fb.group({
        empExpCompany: ['', Validators.required],
        empExpDesignation: ['', Validators.required],
        empExpPlace: ['', Validators.required],
        empExpFromDate: ['', Validators.required],
        empExpToDate: ['', Validators.required],
        empExpYear: ['', Validators.required],
        empExpMonth: ['', Validators.required],
        empExpReasonLeaving: ['', Validators.required],
      })
    );
  }
  // addLeaveDetail(): void {
  //   const leaveDetailFormGroup = this.fb.group({
  //     sno: [0, Validators.required], // Default value, can be changed dynamically
  //     empCode: [null, Validators.required], // Set empCode from component
  //     empLeavesCode: [null, Validators.required], // To be populated dynamically
  //     empLeavesEffectiveDate: [null, Validators.required], // Effective date
  //     isPermitted: [true] // Default to true
  //   });

  //   this.empAllotedLeaves.push(leaveDetailFormGroup); // Add to FormArray
  // }

  get empAllotedLeaves(): FormArray {
    return this.employeeForm.get('empAllotedLeaves') as FormArray;
  }

  addQualificationExperience() {
    const qualificationExpFormGroup = this.fb.group({
      sno: [],  // Auto-increment sno
      empCode: [],                           // Set empCode for the new row
      empQualification: [''],
      empPassingYear: [''],
      empInstitute: [''],
      empScore: [''],
      empExpCompany: [''],
      empExpDesignation: [''],
      empExpPlace: [''],
      empExpFromDate: [''],
      empExpToDate: [''],
      empExpYear: [''],
      empExpMonth: [''],
      empExpReasonLeaving: ['']
    });

    this.empQualificationExperience.push(qualificationExpFormGroup);
  }


  // Get empQualificationExperience as a FormArray
  get empQualificationExperience() {
    return (this.employeeForm.get('empQualificationExperience') as FormArray);
  }
  loadLeaveTypes(): void {
    this.leaveService.getLeaveTypes().subscribe({
      next: (leaveTypes) => {
        this.leaveTypes = leaveTypes; // Store all available leave types
        this.initializeLeaveDetails(); // Initialize leave details without empCode
      },
      error: (error) => {
        console.error('Error fetching leave types:', error);
      }
    });
  }

  initializeLeaveDetails(): void {
    const leaveArray = this.employeeForm.get('empAllotedLeaves') as FormArray; // Access FormArray

    this.leaveTypes.forEach((leaveType) => {
      leaveArray.push(
        this.fb.group({
          sno: [leaveType.sno, Validators.required], // Leave type's SNO
          empCode: [null, Validators.required], // Set empCode from component
          empLeavesCode: [leaveType.sno, Validators.required], // Leave Code (SNO used as ID)
          empLeavesEffectiveDate: [null, Validators.required], // Default to null
          isPermitted: [this.isLeavePermitted(leaveType.sno)] // Determine permission status dynamically
        })
      );
    });
  }


  isLeavePermitted(leaveCode: number): boolean {
    const leaveDetail = this.empLeaveDetails.find(detail => detail.empLeavesCode === leaveCode);
    return leaveDetail ? leaveDetail.isPermitted : false;
  }



  onSubmit(event: Event): void {
    event.preventDefault();

    // Extracting values from the FormArray
    // Assuming qualifications and experiences are arrays from FormArray
    const qualifications = this.qualifications.value;
    const experiences = this.experiences.value;

    // Ensure both arrays have the same length by filling missing values with null objects
    const maxLength = Math.max(qualifications.length, experiences.length);
    const paddedQualifications = [...qualifications, ...Array(maxLength - qualifications.length).fill({
      sno: null,
      empCode: null,
      empQualification: null,
      empPassingYear: null,
      empInstitute: null,
      empScore: null
    })];

    const paddedExperiences = [...experiences, ...Array(maxLength - experiences.length).fill({
      empExpCompany: null,
      empExpDesignation: null,
      empExpPlace: null,
      empExpFromDate: null,
      empExpToDate: null,
      empExpYear: null,
      empExpMonth: null,
      empExpReasonLeaving: null
    })];

    // Combine both arrays into one with merged fields
    const empQualificationExperience = paddedQualifications.map((qualification, index) => ({
      sno: qualification.sno,
      empCode: qualification.empCode,
      empQualification: qualification.empQualification,
      empPassingYear: qualification.empPassingYear,
      empInstitute: qualification.empInstitute,
      empScore: qualification.empScore,
      empExpCompany: paddedExperiences[index].empExpCompany,
      empExpDesignation: paddedExperiences[index].empExpDesignation,
      empExpPlace: paddedExperiences[index].empExpPlace,
      empExpFromDate: paddedExperiences[index].empExpFromDate,
      empExpToDate: paddedExperiences[index].empExpToDate,
      empExpYear: paddedExperiences[index].empExpYear,
      empExpMonth: paddedExperiences[index].empExpMonth,
      empExpReasonLeaving: paddedExperiences[index].empExpReasonLeaving
    }));

    // Combine into final payload
    const employeeData = {
      ...this.employeeForm.value,
      empQualificationExperience
    };

    console.log(employeeData);


    // Call the API with the complete data
    this.employeeService.postEmployeeData(employeeData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data posted successfully!',
          life: 3000, // Display duration in milliseconds
        });
        console.log('Data posted successfully:', response);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while posting data.',
          life: 3000,
        });
        console.error('Error posting data:', error);
      },
    });
  }
  copyTempToPerm() {
    const empAddressForm = this.employeeForm.get('empAddress');

    // Check if the form and controls are not null
    if (empAddressForm) {
      const tempAddress = empAddressForm.get('empTempAddr')?.value;
      const tempCountry = empAddressForm.get('empTempCountry')?.value;
      const tempState = empAddressForm.get('empTempState')?.value;
      const tempCity = empAddressForm.get('empTempCity')?.value;
      const tempPinCode = empAddressForm.get('empTempPinCode')?.value;
      const tempPhoneNo = empAddressForm.get('empTempPhoneNo')?.value;
      const tempLongitude = empAddressForm.get('empTempLongitude')?.value;
      const tempLatitude = empAddressForm.get('empTempLatitude')?.value;

      // Now assign these values to the permanent address fields
      empAddressForm.get('empPermAddr')?.setValue(tempAddress);
      empAddressForm.get('empPermCountry')?.setValue(tempCountry);
      empAddressForm.get('empPermState')?.setValue(tempState);
      empAddressForm.get('empPermCity')?.setValue(tempCity);
      empAddressForm.get('empPermPinCode')?.setValue(tempPinCode);
      empAddressForm.get('empPermPhoneNo')?.setValue(tempPhoneNo);
      empAddressForm.get('empPermLongitude')?.setValue(tempLongitude);
      empAddressForm.get('empPermLatitude')?.setValue(tempLatitude);
    }
  }

  isMarried: boolean = false;
  onMaritalStatusChange(event: any): void {
    const maritalStatus = event.target.value;
    this.isMarried = maritalStatus === 'Married';

    if (!this.isMarried) {
      // Clear spouse name and anniversary date when unmarried
      this.employeeForm.get('empSpouseName')?.reset();
      this.employeeForm.get('empAnniversaryDate')?.reset();
    }
  }
  // Visibility of the modal dialog
  isImageInfoCollapsed: boolean = false;
  isLeaveInfoCollapsed: boolean = false;
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

  ];



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

  OvertimeTypes = [
    { label: 'Working Day', value: 'working' },
    { label: 'Non working-Day', value: 'NonWorking' },
    { label: 'Both', value: 'casual' },
  ];

  OverTimeFor = [
    { label: 'None', value: 'none' },
    { label: 'EarlyIn', value: 'EarlyIn' },
    { label: 'LateOut', value: 'LateOut' },
    { label: 'Both', value: 'Both' },
  ];

  NegativeOT = [
    { label: 'None', value: 'none' },
    { label: 'EarlyOut', value: 'EarlyOut' },
    { label: 'LateOut', value: 'LateOut' },
    { label: 'Both', value: 'Both' },
  ];

  RoundOffOption = [
    { label: 'None', value: 'none' },
    { label: 'Upper', value: 'upper' },
    { label: 'Lower', value: 'lower' },
    { label: 'Actual', value: 'actual' },

  ];

  showDialog(id: number) {
    // Fetch employee data by ID
    console.log("openEditDialog called with ID:", id);
    this.employeeService.getEmployeeDetails(id).subscribe((data: any) => {
      // Populate the form with the data received from the API
      this.employeeForm.patchValue({
        empDetail: {
          sno: data.empDetail.sno,
          empCode: data.empDetail.empCode,
          empName: data.empDetail.empName,
          // empImage: data.empDetail.empImage,
          empFatherName: data.empDetail.empFatherName,
          empMotherName: data.empDetail.empMotherName,
          empMartialStatus: data.empDetail.empMartialStatus,
          empSpouseName: data.empDetail.empSpouseName,
          empAnniversaryDate: data.empDetail.empAnniversaryDate,
          empReligion: data.empDetail.empReligion,
          empDateOfBirth: data.empDetail.empDateOfBirth,
          empMobileNo: data.empDetail.empMobileNo,
          empMail: data.empDetail.empMail,
          empSex: data.empDetail.empSex,
          empBloodGroup: data.empDetail.empBloodGroup,
          empNationlity: data.empDetail.empNationlity,
          empCardNo: data.empDetail.empCardNo,
          empEmergencyName: data.empDetail.empEmergencyName,
          empEmergencyRelation: data.empDetail.empEmergencyRelation,
          empEmergencyPhoneNo: data.empDetail.empEmergencyPhoneNo,
          empEmergencyEmail: data.empDetail.empEmergencyEmail,
          empLogin: data.empDetail.empLogin,

        },
        empBankDetail: {
          sno: data.empBankDetail.sno,
          empCode: data.empBankDetail.empCode,
          empBankCode: data.empBankDetail.empBankCode,
          empBankName: data.empBankDetail.empBankName,
          empBranch: data.empBankDetail.empBranch,
          empBankAccount: data.empBankDetail.empBankAccount,
          empIfsccode: data.empBankDetail.empIfsccode,
          empAccountHolderName: data.empBankDetail.empAccountHolderName
        },
        // empAttachment: {
        //   sno: data.empAttachment.sno,
        //   empCode: data.empAttachment.empCode,
        //   empAttachedNo: data.empAttachment.empAttachedNo,
        //   empAttachedDocumentName: data.empAttachment.empAttachedDocumentName,
        //   empAttachedDocument: data.empAttachment.empAttachedDocument
        // },

        empAddress: {
          sno: data.empAddress.sno,
          empCode: data.empAddress.empCode,
          empTempAddr: data.empAddress.empTempAddr,
          empTempCountry: data.empAddress.empTempCountry,
          empTempState: data.empAddress.empTempState,
          empTempCity: data.empAddress.empTempCity,
          empTempPinCode: data.empAddress.empTempPinCode,
          empTempPhoneNo: data.empAddress.empTempPhoneNo,
          empTempLongitude: data.empAddress.empTempLongitude,
          empTempLatitude: data.empAddress.empTempLatitude,
          empPermAddr: data.empAddress.empPermAddr,
          empPermCountry: data.empAddress.empPermCountry,
          empPermState: data.empAddress.empPermState,
          empPermCity: data.empAddress.empPermCity,
          empPermPinCode: data.empAddress.empPermPinCode,
          empPermPhoneNo: data.empAddress.empPermPhoneNo,
          empPermLongitude: data.empAddress.empPermLongitude,
          empPermLatitude: data.empAddress.empPermLatitude
        },

        empOfficialInformation: {
          sno: data.empOfficialInformation.sno,
          empCode: data.empOfficialInformation.empCode,
          empCityType: data.empOfficialInformation.empCityType,
          empJoiningDate: data.empOfficialInformation.empJoiningDate,
          empConfirmationDate: data.empOfficialInformation.empConfirmationDate,
          empProbationMonth: data.empOfficialInformation.empProbationMonth,
          empNoitceDays: data.empOfficialInformation.empNoitceDays,
          empSalaryWages: data.empOfficialInformation.empSalaryWages,
          empPan: data.empOfficialInformation.empPan,
          empUanno: data.empOfficialInformation.empUanno,
          empVoterCardNo: data.empOfficialInformation.empVoterCardNo,
          empAadharCardNo: data.empOfficialInformation.empAadharCardNo,
          empPassportNo: data.empOfficialInformation.empPassportNo,
          empPassportValidDate: data.empOfficialInformation.empPassportValidDate,
          empDlno: data.empOfficialInformation.empDlno,
          empDlvalidDate: data.empOfficialInformation.empDlvalidDate
        },
        empPostingAttachment: {
          sno: data.empPostingAttachment.sno,
          empCode: data.empPostingAttachment.empCode,
          empDepartmentCode: data.empPostingAttachment.empDepartmentCode,
          empDesignationCode: data.empPostingAttachment.empDesignationCode,
          empReportingTo: data.empPostingAttachment.empReportingTo,
          empShift: data.empPostingAttachment.empShift,
          empEffectiveDate: data.empPostingAttachment.empEffectiveDate,
          empOvertimeId: data.empPostingAttachment.empOvertimeId

        },

      });

      // Handle empQualificationExperience as FormArray
      const qualificationsArray = this.qualifications;
      const experiencesArray = this.experiences;

      // Clear existing rows in both FormArrays
      qualificationsArray.clear();
      experiencesArray.clear();

      // Populate qualifications
      data.empQualificationExperience.forEach((item: any) => {
        if (item.empQualification) {
          qualificationsArray.push(this.fb.group({
            sno: item.sno || null,
            empCode: item.empCode || null,
            empQualification: item.empQualification || null,
            empPassingYear: item.empPassingYear || null,
            empInstitute: item.empInstitute || null,
            empScore: item.empScore || null
          }));
        }

        // Populate experiences
        if (item.empExpCompany) {
          experiencesArray.push(this.fb.group({
            empExpCompany: item.empExpCompany || null,
            empExpDesignation: item.empExpDesignation || null,
            empExpPlace: item.empExpPlace || null,
            empExpFromDate: item.empExpFromDate || null,
            empExpToDate: item.empExpToDate || null,
            empExpYear: item.empExpYear || null,
            empExpMonth: item.empExpMonth || null,
            empExpReasonLeaving: item.empExpReasonLeaving || null
          }));
        }
      });
      const leavesArray = this.empAllotedLeaves;
      leavesArray.clear();
      data.empAllotedLeaves.forEach((leave: any) => {
        leavesArray.push(this.fb.group({
          sno: leave.sno || null,
          empCode: leave.empCode || null,
          empLeavesCode: leave.empLeavesCode || null,
          empLeavesEffectiveDate: leave.empLeavesEffectiveDate || null,
          isPermitted: leave.isPermitted || false
        }));
      });

      console.log('Populated Form:', this.employeeForm.value);

      // Make the edit dialog visible
      this.visible = true;
    });
  }




  // Method to hide the dialog
  hideDialog() {
    this.visible = false;
  }




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

  isSubmitting = false;
  onSave(event: Event): void {
    event.preventDefault();
    this.isSubmitting = true;
    // Extract qualifications and experiences from FormArray
    const qualifications = this.qualifications.value;
    const experiences = this.experiences.value;

    // Ensure both arrays have the same length
    const maxLength = Math.max(qualifications.length, experiences.length);
    const paddedQualifications = [
      ...qualifications,
      ...Array(maxLength - qualifications.length).fill({
        sno: null,
        empCode: null,
        empQualification: null,
        empPassingYear: null,
        empInstitute: null,
        empScore: null
      }),
    ];

    const paddedExperiences = [
      ...experiences,
      ...Array(maxLength - experiences.length).fill({
        empExpCompany: null,
        empExpDesignation: null,
        empExpPlace: null,
        empExpFromDate: null,
        empExpToDate: null,
        empExpYear: null,
        empExpMonth: null,
        empExpReasonLeaving: null,
      }),
    ];

    // Merge qualifications and experiences into one array
    const empQualificationExperience = paddedQualifications.map((qualification, index) => ({
      sno: qualification.sno,
      empCode: qualification.empCode,
      empQualification: qualification.empQualification,
      empPassingYear: qualification.empPassingYear,
      empInstitute: qualification.empInstitute,
      empScore: qualification.empScore,
      empExpCompany: paddedExperiences[index]?.empExpCompany,
      empExpDesignation: paddedExperiences[index]?.empExpDesignation,
      empExpPlace: paddedExperiences[index]?.empExpPlace,
      empExpFromDate: paddedExperiences[index]?.empExpFromDate,
      empExpToDate: paddedExperiences[index]?.empExpToDate,
      empExpYear: paddedExperiences[index]?.empExpYear,
      empExpMonth: paddedExperiences[index]?.empExpMonth,
      empExpReasonLeaving: paddedExperiences[index]?.empExpReasonLeaving,
    }));

    // Include empCode from the form
    const empCode = this.employeeForm.value.empDetail.empCode;

    // Construct the final employee data payload
    const employeeData = {
      ...this.employeeForm.value,
      // Make sure empCode is included
      empQualificationExperience,
    };

    console.log('Updated employee data:', employeeData);

    // Call the API with the updated data
    this.employeeService.updateEmployeeData(empCode, employeeData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee updated successfully!',
        });
        console.log('Employee updated successfully:', response);
        this.isSubmitting = false;

        // Close dialog and refresh the page
        this.visible = false;
        this.holidayService.triggerRefresh();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update employee!',
        });
        this.isSubmitting = false;
        console.error('Error updating employee:', error);
      },
    });
  }



}
