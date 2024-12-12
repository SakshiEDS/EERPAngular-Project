import { Component, OnInit, Input, ViewChild, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectItem } from 'primeng/api'; // For dropdown options
import { FileUpload } from 'primeng/fileupload'; // If using file upload
import { AbstractControl, FormArray, FormsModule, Validators } from '@angular/forms';  // To support ngModel binding
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
import { EmployeeData } from './employe-detail-modal';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { ModalService } from '../../modal.service';
import { DynamicComponent } from '../dynamic/dynamic.component';
import { EmployeeService } from '../../services/employee.service';
import { LateandoutComponent } from '../lateandout/lateandout.component';
import { LeaveMasterService } from '../../services/leave-master.service';
import { OvertimeModalComponent } from "../overtime-modal/overtime-modal.component";
import { HolidayService } from '../../services/holiday.service';
import { PermissionService } from '../../services/permission.service';

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
export class EmployeDetailModalComponent implements OnInit {
  empLeaveDetails: any[] = [];
  leaveTypes: any[] = [];
  // empCode: number = 105; // Example empCode



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
  // stateOptions: any[] = [];

  // onCountryChange(selectedCountry: any): void {
  //   console.log('Country changed:', selectedCountry);
  //   // Add logic here to handle the change in the country
  // }


  stateOptions: any[] = [];
  onStatesUpdated(updatedStates: any[]): void {
    console.log('Updated States:', updatedStates);
    this.stateOptions = updatedStates;
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

  // fileUploads: FormArray;
  // empCode: number = 0; // You can dynamically assign this value based on your scenario



  // // Method to add file row (when user clicks "Add Lines")
  // addFileRow() {
  //   this.fileUploads.push(
  //     this.fb.group({

  //       empCode: [this.empCode || '', Validators.required],
  //       empAttachedDocumentName: ['', Validators.required],
  //       file: [null, Validators.required], // For file input
  //       uploaded: [false], // To track whether the file is uploaded
  //       empAttachedDocumentPath: [null], // For storing the document path
  //       filePreview: [null] // Optional for previewing the file
  //     })
  //   );
  // }

  // // File upload handler
  // // File upload handler
  // onFileUpload(event: any, fileGroup: FormGroup) {
  //   const uploadedFile = event.files[0]; // Extract the uploaded file
  //   fileGroup.patchValue({
  //     uploaded: true,
  //     empAttachedDocumentPath: uploadedFile.name, // Update the document path
  //     filePreview: URL.createObjectURL(uploadedFile) // Optional for previewing
  //   });
  //   // Make sure you also set the 'file' control with the file object
  //   fileGroup.get('file')?.setValue(uploadedFile);
  // }


  // // Post data to API
  // uploadData() {
  //   // Prepare an array of promises to handle individual API calls
  //   const uploadPromises = this.fileUploads.controls.map((control: AbstractControl) => {
  //     const fileGroup = control as FormGroup;

  //     // Fetch empCode from the form group
  //     const empCode = fileGroup.get('empCode')?.value;
  //     const file = fileGroup.get('file')?.value; // Ensure you're getting the file from the form group

  //     if (!file) {
  //       return Promise.reject('No file selected for upload');
  //     }

  //     const formData = new FormData();
  //     formData.append('file', file);  // Attach the file
  //     formData.append('documentName', fileGroup.get('empAttachedDocumentName')?.value); // Attach the document name

  //     // Build the API URL with the empCode for the current row
  //     const apiUrl = `http://localhost:5020/api/EmpAttachment/upload/${empCode}`;

  //     // Make the HTTP POST request and return the promise
  //     return this.http.post(apiUrl, formData).toPromise();
  //   });

  //   // Wait for all upload operations to complete
  //   Promise.all(uploadPromises)
  //     .then(responses => {
  //       console.log('All files uploaded successfully', responses);
  //     })
  //     .catch(error => {
  //       console.error('Error uploading files', error);
  //     });
  // }


  // // To delete a file row if needed
  // deleteFileRow(index: number) {
  //   this.fileUploads.removeAt(index);
  // }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private modalService: ModalService,
    private leaveService: LeaveMasterService,
    private holidayService: HolidayService,
    private permissionService: PermissionService,// Inject MessageService
  ) {



  }



  // Delete file row
  // deleteFileRow(index: number): void {
  //   this.empAttachment.removeAt(index);
  // }
  // onImageUpload(event: any): void {
  //   const file = event.files[0]; // Get the selected file
  //   const formData = new FormData();
  //   formData.append('files', file, file.name); // Corrected key to match backend

  //   // Handle the upload logic here, such as sending it to an API
  //   this.employeeForm.get('empDetail.empImage')?.setValue(file.name);
  //   console.log('Image uploaded successfully');
  // }
  canAddEmp: boolean = false;


  ngOnInit(): void {
    this.canAddEmp = this.permissionService.hasPermission('EmployeMasterComponent', 'EmployeMasterAdd');



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





    this.addQualificationRow();
    this.addExperienceRow();

    this.loadLeaveTypes();

    this.syncEmpCode();

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
    const qualifications = this.employeeForm.get('empQualificationExperience.qualifications') as FormArray;
    const empCode = this.employeeForm.get('empDetail.empCode')?.value; // Get the current empCode

    this.qualifications.push(
      this.fb.group({
        sno: [this.nextSerialNumber++],
        empCode: [empCode],
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

  isSubmitting = false;

  syncEmpCode() {
    const empCodeControl = this.employeeForm.get('empDetail.empCode');

    if (empCodeControl) {
      empCodeControl.valueChanges.subscribe((value) => {
        // Update empCode in the main form sections
        Object.keys(this.employeeForm.controls).forEach((groupName) => {
          const group = this.employeeForm.get(groupName);

          if (group instanceof FormGroup && group.get('empCode')) {
            group.get('empCode')!.setValue(value, { emitEvent: false });
          }
        });

        // Update empCode in the empAllotedLeaves FormArray
        const empAllotedLeaves = this.employeeForm.get('empAllotedLeaves') as FormArray;
        if (empAllotedLeaves) {
          empAllotedLeaves.controls.forEach((leaveGroup) => {
            if (leaveGroup instanceof FormGroup && leaveGroup.get('empCode')) {
              leaveGroup.get('empCode')!.setValue(value, { emitEvent: false });
            }
          });
        }

        // Update empCode in the qualifications FormArray
        const qualifications = this.employeeForm.get('empQualificationExperience.qualifications') as FormArray;
        if (qualifications) {
          qualifications.controls.forEach((qualification) => {
            if (qualification instanceof FormGroup && qualification.get('empCode')) {
              qualification.get('empCode')!.setValue(value, { emitEvent: false });
            }
          });
        }

        // Update empCode in the experiences FormArray
        const experiences = this.employeeForm.get('empQualificationExperience.experiences') as FormArray;
        if (experiences) {
          experiences.controls.forEach((experience) => {
            if (experience instanceof FormGroup && experience.get('empCode')) {
              experience.get('empCode')!.setValue(value, { emitEvent: false });
            }
          });
        }
      });
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


  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitting = true;

    // Check if the form is valid
    // if (this.employeeForm.invalid) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Please fill all the required fields.',
    //     life: 3000, // Display duration in milliseconds
    //   });
    //   return; // Exit if the form is invalid
    // }
    // const formData = new FormData();


    const qualifications = this.qualifications.value;
    const experiences = this.experiences.value;

    // Ensure both arrays have the same length by filling missing values with null objects
    const maxLength = Math.max(qualifications.length, experiences.length);
    const paddedQualifications = [
      ...qualifications,
      ...Array(maxLength - qualifications.length).fill({
        sno: null,
        empCode: null,
        empQualification: null,
        empPassingYear: null,
        empInstitute: null,
        empScore: null,
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
      empExpReasonLeaving: paddedExperiences[index].empExpReasonLeaving,
    }));

    // Combine into final payload
    const employeeData = {
      ...this.employeeForm.value,

      empQualificationExperience,

    };




    // const formData = new FormData();

    // // Append the files (if any) to the form data
    // const imageFile = this.employeeForm.get('empDetail.empImage')?.value;
    // if (imageFile) {
    //   // If image file exists, append it
    //   formData.append('files', imageFile);
    // }

    // // Now, append the other data (employee details, etc.)
    // formData.append('employeeDTO', JSON.stringify(employeeData));
    // console.log(employeeData);
    console.log('Data to be posted:', employeeData);

    // Call the API with the complete data
    this.employeeService.postEmployeeData(employeeData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data posted successfully!',
          life: 3000, // Display duration in milliseconds
        });
        this.holidayService.triggerRefresh();
        this.isSubmitting = false;
        console.log('Data posted successfully:', response);
        this.visible = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while posting data.',
          life: 3000,
        });
        this.isSubmitting = false;
        console.error('Error posting data:', error);
      },
    });
  }

  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];

  //     // Extract only the file name (without the path)
  //     const fileName = file; // Handles both Windows and Unix paths

  //     // Set the file name value to the form control
  //     this.employeeForm.get('empImageFile')?.setValue(fileName);

  //     // Generate a preview URL for the selected image
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.selectedImage = reader.result as string; // Set the preview URL
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     this.selectedImage = null; // Clear the preview if no file is selected
  //   }
  // }


  nextSerialNumber: number = 0; // Counter to track the next serial number


  getNextSerialNumber() {
    this.employeeService.getNextSerialNumber().subscribe(
      (serialNumber) => {
        this.nextSerialNumber = serialNumber; // Initialize a counter for the serial number

        // Update the 'sno' fields in the main form controls
        Object.keys(this.employeeForm.controls).forEach((groupName) => {
          const group = this.employeeForm.get(groupName);
          if (group instanceof FormGroup && group.get('sno')) {
            group.patchValue({ sno: this.nextSerialNumber });
          }
        });

        // Update the 'sno' fields in the qualifications FormArray
        const qualifications = this.employeeForm.get('empQualificationExperience.qualifications') as FormArray;
        if (qualifications) {
          qualifications.controls.forEach((qualification) => {
            if (qualification instanceof FormGroup && qualification.get('sno')) {
              qualification.patchValue({ sno: this.nextSerialNumber++ }); // Increment the serial number
            }
          });
        }

        // Update the 'sno' fields in the experiences FormArray
        const experiences = this.employeeForm.get('empQualificationExperience.experiences') as FormArray;
        if (experiences) {
          experiences.controls.forEach((experience) => {
            if (experience instanceof FormGroup && experience.get('sno')) {
              experience.patchValue({ sno: this.nextSerialNumber++ }); // Increment the serial number
            }
          });
        }
      },
      (error) => {
        console.error('Failed to fetch serial number', error);
      }
    );
  }


  deleteQualificationRow(index: number) {
    // Remove the row from the qualificationData array based on its index
    this.qualificationData.splice(index, 1);
  }

  deleteExperienceRow(index: number) {
    // Remove the row from the experienceData array based on its index
    this.experienceData.splice(index, 1);
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
    {
      degree: 'Degree',
      passingYear: 'Passing Year',
      institute: 'Institute/Board/University',
      score: 'Score'
    }
  ];

  // addQualificationRow() {
  //   // Add a new row to the qualificationData array
  //   this.qualificationData.push({
  //     degree: '',
  //     passingYear: '',
  //     institute: '',
  //     score: ''
  //   });
  // }

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
  // addExperienceRow() {
  //   // Push a new row with empty values to the experienceData array
  //   this.experienceData.push({
  //     companyName: '',
  //     designation: '',
  //     place: '',
  //     fromDate: '',
  //     toDate: '',
  //     year: null,
  //     month: null,
  //     reasonForLeaving: ''
  //   });
  // }

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
  // cities: SelectItem[] = [
  //   { label: 'Mumbai', value: 'Mumbai' },
  //   { label: 'San Francisco', value: 'San Francisco' },
  //   { label: 'Toronto', value: 'Toronto' }
  // ];

  // Method to show the dialog
  showDialog() {
    this.visible = true;
    this.getNextSerialNumber();
  }

  // Method to hide the dialog
  hideDialog() {
    this.visible = false;
  }

  // Method to handle saving the data
  // onSave() {
  //   console.log('Employee details saved!');
  //   this.hideDialog(); // Close the modal after saving
  // }

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
  // onFileUpload(event: any) {
  //   this.profilePicture = event.files[0]; // Store the uploaded file
  //   console.log('Profile picture uploaded!', this.profilePicture);
  // }



  inactive: boolean = false;

  isDialogVisible: boolean = false; // Dialog visibility state

  openDialog(): void {
    this.isDialogVisible = true; // Show the dialog when called
  }

  closeDialog(): void {
    this.isDialogVisible = false; // Optional method to close the dialog programmatically
  }
  files: any[] = [];

  // get fileUploads(): FormArray {
  //   return this.fileUploadForm.get('fileUploads') as FormArray;
  // 


  // get fileUploads(): FormArray {
  //   return this.fileUploadForm.get('fileUploads') as FormArray;
  // }

  // Add new file row to the form
  // addFileRow() {
  //   const row = this.fb.group({
  //     fileName: ['', Validators.required],
  //     file: [null],
  //     filePreview: [null],  // Preview for uploaded file
  //     uploaded: [false],  // Track upload state
  //   });

  //   this.fileUploads.push(row);  // Push the new row to the FormArray
  // }

  // Remove file row from the form
  // deleteFileRow(index: number) {
  //   this.fileUploads.removeAt(index);
  // }

  // Handle file upload event
  // onFileUpload(event: any, file: any) {
  //   const uploadedFile = event.files[0];

  //   // Check if the file is an image (or handle other file types as needed)
  //   if (uploadedFile && uploadedFile.type.startsWith('image')) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       file.filePreview = reader.result as string;  // Set the preview for the image
  //     };
  //     reader.readAsDataURL(uploadedFile);
  //   } else if (uploadedFile && uploadedFile.type === 'application/pdf') {
  //     // Handle PDF files (store the file URL for preview)
  //     file.filePreview = URL.createObjectURL(uploadedFile);
  //   } else {
  //     // Handle non-image, non-PDF files (e.g., Excel, Word)
  //     file.file = uploadedFile;  // Store the uploaded file in the form
  //   }

  //   file.uploaded = true;  // Mark as uploaded
  // }

  // Preview the uploaded file
  previewFile(file: any) {
    // If file preview is available (image or pdf preview)
    if (file.filePreview) {
      // If it's an image (starts with 'data:image') or a PDF (ends with '.pdf')
      if (file.filePreview.startsWith('data:image')) {
        // Open image preview in a new window
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write('<img src="' + file.filePreview + '" width="100%" />');
        } else {
          console.error('Failed to open preview window.');
        }
      } else if (file.filePreview.endsWith('.pdf')) {
        // Open PDF preview in a new window
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write('<embed src="' + file.filePreview + '" type="application/pdf" width="100%" height="100%" />');
        } else {
          console.error('Failed to open preview window.');
        }
      }
    } else if (file.file) {
      // If no preview is available, handle other file types (e.g., Excel, Word)
      const fileType = file.file.type;

      if (fileType.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
        fileType.startsWith('application/msword') ||
        fileType.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        // Trigger download for Excel or Word files
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(file.file);
        downloadLink.download = file.file.name; // Set the filename for download
        downloadLink.click();
      } else {
        // If it's an unsupported file type, show an alert
        alert('No preview available for this file type.');
      }
    }
  }

}
