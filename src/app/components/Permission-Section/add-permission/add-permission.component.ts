import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
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

import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EmployeeService } from '../../../services/employee.service';
import { UserServiceService } from '../../../services/user-service.service';
import { HolidayService } from '../../../services/holiday.service';
import { RoleServiceService } from '../../../services/role-service.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrl: './add-permission.component.scss',
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
  ],
})

export class AddPermissionComponent {

  visible = false;

  // Properties for input fields
  name: string = '';
  activeStatus: boolean = false;
  description: string = '';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private permissionService: RoleServiceService,
  ) { }

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  isSubmitting = false;

  onSubmit(): void {
    this.isSubmitting = true;
    if (!this.name || !this.description) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Name and Description are required.'
      });
      this.isSubmitting = false;
      return;
    }

    const payload = {
      sno: 0, // Default value
      name: this.name,
      activeStatus: this.activeStatus,
      description: this.description
    };

    this.permissionService.createPermission(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permission created successfully.' });
        this.isSubmitting = false;
        this.resetForm(); // Reset the input fields
        this.hideDialog(); // Close the dialog
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create permission.' });
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.name = '';
    this.activeStatus = false;
    this.description = '';
  }






}
