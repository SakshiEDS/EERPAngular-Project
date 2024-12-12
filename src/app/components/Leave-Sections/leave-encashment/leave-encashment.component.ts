import { Component, EventEmitter, Output } from '@angular/core';
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
import { Card, CardModule } from 'primeng/card';

@Component({
  selector: 'app-leave-encashment',
  templateUrl: './leave-encashment.component.html',
  styleUrl: './leave-encashment.component.scss',
  standalone:true,
  imports:[DialogModule, ButtonModule, FormsModule,  // Make sure you have FormsModule for ngModel
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
    CardModule
  ],

})
export class LeaveEncashmentComponent {
  voucherDate: Date | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;

  employees = [
    { label: 'John Doe', value: 1 },
    { label: 'Jane Smith', value: 2 },
    { label: 'Alice Johnson', value: 3 }
  ];
  selectedEmployee: number | null = null;

  leaveCodes = [
    { label: 'Sick Leave', value: 'SL' },
    { label: 'Casual Leave', value: 'CL' },
    { label: 'Earned Leave', value: 'EL' }
  ];
  selectedLeaveCode: string | null = null;

  voucherNo: string = '00002';
  reason: string = '';
  remark: string = '';
  remarkFinance: string = '';
}