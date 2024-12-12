import { Component, OnInit, ViewChild } from "@angular/core";
import { Customer, Representative } from "../../../domain/customer";
import { Table, TableModule } from "primeng/table";
import { CustomerService } from "../../../service/customerservice";
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
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

// import { CustomerService } from '../../../service/customerservice';
// import { Customer, Representative } from '../../../domain/customer';
import { CommonModule } from '@angular/common';
import { EmployeDetailModalComponent } from "../employe-detail-modal/employe-detail-modal.component";
import { EmployeeData } from "../employe-detail-modal/employe-detail-modal";
import { MessageService } from "primeng/api";
// import { CustomerService } from 'src/service/customerservice';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditComponent } from "../edit/edit.component";
import { EmployeeService } from "../../services/employee.service";
import { HolidayService } from "../../services/holiday.service";
import { FileUploadModule } from "primeng/fileupload";
import { DialogModule } from "primeng/dialog";
import { PermissionService } from "../../services/permission.service";

@Component({
  selector: 'app-employe-master',
  templateUrl: './employe-master.component.html',
  styleUrls: ['./employe-master.component.scss'],
  standalone: true,
  imports: [
    TableModule, TagModule, ButtonModule, IconFieldModule, InputIconModule, HttpClientModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, SliderModule, ProgressBarModule,
    FormsModule, AvatarModule,
    EmployeDetailModalComponent, ReactiveFormsModule, ToastModule, ConfirmDialogModule, EditComponent, FileUploadModule, DialogModule
  ],
  providers: [CustomerService, MessageService, ConfirmationService],
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
export class EmployeMasterComponent implements OnInit {
  customers!: Customer[];
  selectedCustomers!: Customer[];
  representatives!: Representative[];
  statuses!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  searchValue: string = ''; // Holds global search input value
  @ViewChild('dt') dt: Table | undefined; // Table reference
  showModal: boolean = false;



  clear(table: Table) {
    table.clear(); // Clear all table filters
    this.searchValue = ''; // Reset search input
  }

  applyGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  getSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Pending":
        return "warning";
      case "Banned":
        return "danger";
      default:
        return undefined; // Ensure undefined instead of null
    }
  }

  // showModal = false;

  // openModal() {
  //   this.showModal = true;
  // }

  // closeModal() {
  //   this.showModal = false;
  // }

  // openEditDialog(employee: any): void {
  //   this.selectedEmployee = employee;
  //   this.modalVisible = true; // Show the modal
  // }

  // Close the modal
  // closeModal(): void {
  //   this.modalVisible = false; // Hide the modal
  // }
  employeeForm!: FormGroup;



  openModal() {
    this.showModal = true;
  }

  // closeModal() {
  //   this.showModal = false;
  // }



  // onSubmit(): void {
  //   const employeeData: EmployeeData = this.employeeForm.value;

  //   this.http.post('http://localhost:5020/api/EmployeeDetails', employeeData).subscribe({
  //     next: (response) => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Data posted successfully!',
  //         life: 3000 // Display duration in milliseconds
  //       });
  //       console.log('Data posted successfully:', response);
  //     },
  //     error: (error) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'An error occurred while posting data.',
  //         life: 3000
  //       });
  //       console.error('Error posting data:', error);
  //     }
  //   });


  // }



  fileUploads: FormArray; // Form array for dynamic rows
  isUploadDialogVisible: boolean = false; // Toggle for dialog visibility
  // empCode: number = 0; // To hold selected employee code

  fileUploadStatus: { [key: number]: boolean } = {}; // To track upload status for each employee

  selectedEmpCode: number | null = null;


  // Open dialog and set employee code
  openUploadDialog(empCode: number): void {
    this.selectedEmpCode = empCode; // Set the employee code for the dialog
    this.isUploadDialogVisible = true; // Show the dialog
    this.fetchUploadedDocuments();
    this.holidayService.refresh$.subscribe(() => {
      this.fetchUploadedDocuments(); // Reload the data when notified
    });
  }

  // Add a new file row
  addFileRow(): void {
    this.fileUploads.push(
      this.fb.group({
        empCode: [this.selectedEmpCode || '', Validators.required], // Employee code
        empAttachedDocumentName: ['', Validators.required], // Document name
        file: [null, Validators.required], // File input
        uploaded: [false], // Track upload status
        empAttachedDocumentPath: [null], // Document path
        filePreview: [null],
        fileError: [''] // Optional for preview
      })
    );
  }

  // Handle file upload
  onFileUpload(event: any, fileGroup: FormGroup): void {
    const file = event.files[0];

    // Check file type
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension || '')) {
      // Set the error message in the form control
      fileGroup.get('fileError')?.setValue('Unsupported file format. Only jpg, jpeg, png, pdf are allowed.');
      // Prevent uploading
      return;
    }

    // Clear any existing error message
    fileGroup.get('fileError')?.setValue('');

    // Proceed with the upload if the file type is valid
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentName', fileGroup.get('empAttachedDocumentName')?.value);

    const apiUrl = `http://localhost:5020/api/EmpAttachment/upload/${fileGroup.get('empCode')?.value}`;

    this.http.post(apiUrl, formData).subscribe(response => {
      fileGroup.get('uploaded')?.setValue(true);
      console.log('File uploaded successfully', response);
    }, error => {
      console.error('Error uploading file', error);
    });
  }



  // In your component or service

  // Fetch the file path from the server using empCode
  // Update getFileForEmployee to return a filePath as a Promise

  isDocumentListDialogVisible: boolean = false; // Toggle document list dialog visibility
  employeeDocuments: { name: string; path?: string }[] = [];


  // openFileListDialog(empCode: number): void {
  //   this.selectedEmpCode = empCode;
  //   const apiUrl = `http://localhost:5020/api/EmpAttachment/view-documents/${empCode}`;

  //   this.http.get<string[]>(apiUrl).subscribe(
  //     (documents) => {
  //       this.employeeDocuments = documents || [];
  //       this.isDocumentListDialogVisible = true;
  //     },
  //     (error) => {
  //       console.error('Error fetching documents:', error);
  //       this.employeeDocuments = [];
  //       this.isDocumentListDialogVisible = true;
  //     }
  //   );
  // }

  // Preview a specific document
  previewFile(filePath: string): void {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      console.error('Failed to open preview window.');
      return;
    }

    if (filePath.endsWith('.jpg') || filePath.endsWith('.png') || filePath.endsWith('.jpeg')) {
      previewWindow.document.write(`<img src="${filePath}" width="100%" />`);
    } else if (filePath.endsWith('.pdf')) {
      previewWindow.document.write(`<embed src="${filePath}" type="application/pdf" width="100%" height="100%" />`);
    } else {
      previewWindow.document.write(`<p>Unsupported file format: ${filePath}</p>`);
    }
  }




  // Submit all files to the API
  uploadData(): void {
    const uploadPromises = this.fileUploads.controls.map((control: AbstractControl) => {
      const fileGroup = control as FormGroup;
      const empCode = fileGroup.get('empCode')?.value;
      const file = fileGroup.get('file')?.value;
      const documentName = fileGroup.get('empAttachedDocumentName')?.value || file?.name;

      if (!file) {
        return Promise.reject('No file selected for upload');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentName', documentName);

      const apiUrl = `http://localhost:5020/api/EmpAttachment/upload/${empCode}`;

      // Optimistic UI update: Add the document to the local array before upload
      this.employeeDocuments.push({ name: documentName });

      return this.http.post(apiUrl, formData).toPromise()
        .catch(error => {
          // Rollback the optimistic update in case of an error
          console.error('Error uploading file:', error);
          this.employeeDocuments = this.employeeDocuments.filter(doc => doc.name !== documentName);
          throw error;
        });
    });

    Promise.all(uploadPromises)
      .then(responses => {
        console.log('All files uploaded successfully:', responses);

        // Optionally fetch updated documents to ensure consistency
        this.fetchUploadedDocuments();
      })
      .catch(error => {
        console.error('Error uploading files:', error);
      });
  }

  fetchUploadedDocuments(): void {
    const apiUrl = `http://localhost:5020/api/EmpAttachment/view-documents/${this.selectedEmpCode}`;
    this.http.get<{ name: string; path?: string }[]>(apiUrl).subscribe(
      (documents) => {
        this.employeeDocuments = documents || [];
      },
      (error) => {
        console.error('Error fetching documents:', error);
        this.employeeDocuments = [];
      }
    );
  }



  // Delete a row from the file uploads table
  deleteFileRow(index: number): void {
    this.fileUploads.removeAt(index); // Remove the row
  }

  // Preview the uploaded file
  // previewFile(file: any): void {
  //   console.log('Preview file:', file);  // Log to check file details
  //   if (file.filePreview) {
  //     // If it's an image, open it in a new window
  //     if (file.filePreview.startsWith('data:image')) {
  //       const previewWindow = window.open('', '_blank');
  //       if (previewWindow) {
  //         previewWindow.document.write(`<img src="${file.filePreview}" width="100%" />`);
  //       } else {
  //         console.error('Failed to open preview window.');
  //       }
  //     }
  //     // If it's a PDF, open it in a new window
  //     else if (file.filePreview.endsWith('.pdf')) {
  //       const previewWindow = window.open('', '_blank');
  //       if (previewWindow) {
  //         previewWindow.document.write(`<embed src="${file.filePreview}" type="application/pdf" width="100%" height="100%" />`);
  //       } else {
  //         console.error('Failed to open preview window.');
  //       }
  //     }
  //   } else {
  //     console.error('No file preview available');
  //   }
  // }


  isSubmitting = false;
  apiUrl = 'http://localhost:5020/api/EmpDetails';
  deleteEmployee(employeeId: number) {
    // Use the ConfirmationService to show a confirmation dialog
    this.isSubmitting = true;
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // If user confirms deletion, proceed with HTTP DELETE request
        this.http.delete(`${this.apiUrl}/${employeeId}`).subscribe({
          next: () => {
            // On successful deletion, remove the employee from the employees list
            this.employees = this.employees.filter(employee => employee.code !== employeeId);

            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee deleted successfully!' });
            this.loadEmployeeData();
            this.isSubmitting = false;
          },
          error: (err) => {
            // Handle error (show an error message)
            console.error('Error deleting employee:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete employee!' });
            this.isSubmitting = false;
          }
        });
      },
      reject: () => {
        // Handle cancellation
        console.log('Deletion cancelled');
      }
    });
  }



  // export class EmployeMasterComponent implements OnInit {
  employees: any[] = [];
  // employee: EmployeeData[] = [];
  // employe!: EmployeeData;  // employee!:EmployeeData;
  selectedEmployee: any;
  modalVisible: boolean = false;
  isEditModal: boolean = false;

  canViewEmp: boolean = false;
  canUpdateEmp: boolean = false;
  canDeleteEmp: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private employeeService: EmployeeService,
    private confirmationService: ConfirmationService,
    private holidayService: HolidayService,
    private permissionService: PermissionService,
    // private modalService: ModalService
  ) {
    this.fileUploads = this.fb.array([]);
  }
  ngOnInit(): void {
    // this.initializeForm();
    this.canViewEmp = this.permissionService.hasPermission('EmployeMasterComponent', 'EmployeMasterView');
    this.canUpdateEmp = this.permissionService.hasPermission('EmployeMasterComponent', 'EmployeMasterUpdate');
    this.canDeleteEmp = this.permissionService.hasPermission('EmployeMasterComponent', 'EmployeMasterDelete');
    if (this.canViewEmp) {

      this.loadEmployeeData();
      this.holidayService.refresh$.subscribe(() => {
        this.loadEmployeeData(); // Reload the data when notified
      });
    }

  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      empDetail: this.fb.group({
        sno: [],
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
        empLogin: [false],
        empInTime: [''],
        empOutTime: [''],
        empReportingTo: [''],
        empShift: [''],
        empDesignation: [],
        empDepartment: []
      }),
      empBankDetail: this.fb.group({
        sno: [],
        empCode: [],
        empBankCode: [],
        empBankName: [''],
        empBranch: [''],
        empBankAccount: [],
        empIfsccode: [''],
        empAccountHolderName: ['']
      }),
      empAttachment: this.fb.group({
        sno: [],
        empCode: [],
        empAttachedNo: [''],
        empAttachedDocumentName: [''],
        empAttachedDocument: ['']
      }),
      empLeaveDetail: this.fb.group({
        sno: [],
        empCode: [],
        empLeavesType: [''],
        empLeavesAllot: ['']
      }),

      empAddress: this.fb.group({
        sno: [],
        empCode: [],
        empTempAddr: [''],
        empTempCountry: [''],
        empTempState: [''],
        empTempCity: [],
        empTempPinCode: [],
        empTempPhoneNo: [],
        empTempLongitude: [''],
        empTempLatitude: [''],
        empPermAddr: [''],
        empPermCountry: [''],
        empPermState: [''],
        empPermCity: [],
        empPermPinCode: [],
        empPermPhoneNo: [],
        empPermLongitude: [''],
        empPermLatitude: [''],
      }),
      empOfficialInformation: this.fb.group({
        sno: [],
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
        sno: [],
        empCode: [],
        empDepartmentCode: [],
        empDesignationCode: [],
        empDepartment: [''],
        empDesignation: ['']
      }),

      empQualificationExperience: this.fb.array([])

    });

  }
  get empQualificationExperience(): FormArray {
    return this.employeeForm.get('empQualificationExperience') as FormArray;
  }
  loadEmployeeData(): void {
    this.employeeService.getEmployeeData().subscribe({

      next: (data) => {
        console.log('Fetched Employee Data:', data);
        this.employees = data;

      },

      error: (error) => {

        console.error('Error fetching employee data:', error);
      }
    });
  }
  visible: boolean = false; // Controls visibility of the modal
  // selectedEmployee: any;    // Store selected employee data

  // Method to open modal when clicking 'Edit' button
  // openEditModal(employee: any) {
  //   this.selectedEmployee = employee; // Assign selected employee data
  //   this.isEditModal = true; // Set flag to edit mode
  //   this.showDialog(); // Trigger showDialog functionality
  // }

  openEditDialog(employeeId: number): void {
    this.http.get(`${this.apiUrl}/${employeeId}`).subscribe({
      next: (data: any) => {
        this.employeeForm.patchValue(data);
        console.log(data);
        this.showModal = true;
      },
      error: (err) => {
        console.error('Error fetching employee data:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load employee details.',
        });
      },
    });
  }

  // Show the modal by setting 'visible' to true
  // showDialog() {

  //   this.visible = true; // Open the modal
  // }


  showDialog(id: number) {
    // Fetch employee data by ID
    console.log("openEditDialog called with ID:", id);
    this.http.get(`http://13.233.79.234/eERPapi/api/EmpDetails/${id}`).subscribe((data: any) => {
      // Populate the form with the data received from the API
      this.employeeForm.patchValue({
        empDetail: {
          sno: data.empDetail.sno,
          empCode: data.empDetail.empCode,
          empName: data.empDetail.empName,
          empImage: data.empDetail.empImage,
          empFatherName: data.empDetail.empFatherName,
          empMotherName: data.empDetail.empMotherName,
          empMartialStatus: data.empDetail.empMartialStatus,
          empSpouseName: data.empDetail.empSpouseName,
          empAnniversaryDate: data.empDetail.empAnniversaryDate,
          empReligion: data.empDetail.empReligion,
          empDateOfBirth: data.empDetail.empDateOfBirth,
          empSex: data.empDetail.empSex,
          empBloodGroup: data.empDetail.empBloodGroup,
          empNationlity: data.empDetail.empNationlity,
          empCardNo: data.empDetail.empCardNo,
          empEmergencyName: data.empDetail.empEmergencyName,
          empEmergencyRelation: data.empDetail.empEmergencyRelation,
          empEmergencyPhoneNo: data.empDetail.empEmergencyPhoneNo,
          empEmergencyEmail: data.empDetail.empEmergencyEmail,
          empLogin: data.empDetail.empLogin,
          empInTime: data.empDetail.empInTime,
          empOutTime: data.empDetail.empOutTime,
          empReportingTo: data.empDetail.empReportingTo,
          empShift: data.empDetail.empShift,
          empDesignation: data.empDetail.empDesignation,
          empDepartment: data.empDetail.empDepartment
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
        empAttachment: {
          sno: data.empAttachment.sno,
          empCode: data.empAttachment.empCode,
          empAttachedNo: data.empAttachment.empAttachedNo,
          empAttachedDocumentName: data.empAttachment.empAttachedDocumentName,
          empAttachedDocument: data.empAttachment.empAttachedDocument
        },
        empLeaveDetail: {
          sno: data.empLeaveDetail.sno,
          empCode: data.empLeaveDetail.empCode,
          empLeavesType: data.empLeaveDetail.empLeavesType,
          empLeavesAllot: data.empLeaveDetail.empLeavesAllot
        },
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
          empDepartment: data.empPostingAttachment.empDepartment,
          empDesignation: data.empPostingAttachment.empDesignation
        },
      });

      // Handle empQualificationExperience as FormArray
      const qualificationFormArray = this.employeeForm.get('empQualificationExperience') as FormArray;
      qualificationFormArray.clear(); // Clear previous values

      data.empQualificationExperience.forEach((item: any) => {
        qualificationFormArray.push(this.fb.group({
          sno: item.sno,
          empCode: item.empCode,
          empQualification: item.empQualification,
          empPassingYear: item.empPassingYear,
          empInstitute: item.empInstitute,
          empScore: item.empScore,
          empExpCompany: item.empExpCompany,
          empExpDesignation: item.empExpDesignation,
          empExpPlace: item.empExpPlace,
          empExpFromDate: item.empExpFromDate,
          empExpToDate: item.empExpToDate,
          empExpYear: item.empExpYear,
          empExpMonth: item.empExpMonth,
          empExpReasonLeaving: item.empExpReasonLeaving
        }));
      });
      console.log(data);
      // Make the edit dialog visible after populating the form
      this.visible = true;
    });
  }





  // Hide the modal by setting 'visible' to false
  hideDialog() {
    this.visible = false; // Close the modal
    this.isEditModal = false; // Reset flag when modal is closed
  }

}
























































































































































































































































































































// }