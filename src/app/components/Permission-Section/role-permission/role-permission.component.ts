import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CheckboxModule } from 'primeng/checkbox';
import { HolidayService } from '../../../services/holiday.service';
import { OvertimeserviceService } from '../../../services/overtimeservice.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { RoleServiceService } from '../../../services/role-service.service';
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
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrl: './role-permission.component.scss',
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
    CheckboxModule,
    MultiSelectModule
  ],
  providers: [MessageService, MultiSelectModule]
})

export class RolePermissionComponent implements OnInit, OnDestroy {
  isDialogVisible: boolean = false;
  rolePermissionId: number | null = null;
  rolePermissionName: string = '';
  selectedPermissions: string[] = [];
  permissions: any[] = [];
  rolePermissions: { id: number; name: string }[] = [];
  selectedRolePermission: number | null = null;

  // private cachedRolePermissions: any[] = [];
  private saveQueue: any[] = [];
  private retryInterval: any;

  constructor(private http: HttpClient, private messageService: MessageService, private roleService: RoleServiceService, private holidayService: HolidayService,) { }

  ngOnInit(): void {
    this.loadRolePermissions();
    // this.startRetryQueue();
    this.holidayService.refresh$.subscribe(() => {
      this.loadRolePermissions(); // Reload the data when notified
    });
  }

  // Generic error handler
  handleError(error: any, userMessage: string): void {
    console.error('Server Error:', error);

    if (error.status === 0) {
      // Server unreachable
      this.messageService.add({
        severity: 'warn',
        summary: 'Offline Mode',
        detail: 'The server is currently unreachable. Displaying cached data.',
      });
    } else {
      // Specific API error
      this.messageService.add({ severity: 'error', summary: 'Error', detail: userMessage });
    }
  }

  // Load role permissions with caching
  loadRolePermissions(): void {
    this.roleService.getRolePermissions().subscribe(
      (data) => {
        this.rolePermissions = data.map((role) => ({
          id: role.rolePermissionId,
          name: role.rolePermissionName,
        }));

        // Cache the data
        // this.cachedRolePermissions = this.rolePermissions;
      },
      (error) => {
        this.handleError(error, 'Error fetching role permissions.');
        // Use cached data if server fails
        // if (this.cachedRolePermissions.length > 0) {
        //   this.rolePermissions = this.cachedRolePermissions;
        // }
      }
    );
  }


  openDialog(selectedRoleId: number | null): void {
    if (selectedRoleId !== null) {
      // Existing role selected, load its permissions
      const selectedRole = this.rolePermissions.find((role) => role.id === selectedRoleId);
      if (selectedRole) {
        this.rolePermissionId = selectedRole.id;
        this.rolePermissionName = selectedRole.name;
        this.fetchPermissionsForRole(this.rolePermissionId);
      }
    } else {
      // No role selected, creating a new role
      this.rolePermissionId = 0;
      this.rolePermissionName = '';
      this.selectedPermissions = [];
      this.resetPermissionSelection();

      // Fetch permissions for the new role
      this.fetchPermissionsForNewRole();
    }
    this.isDialogVisible = true;
  }
  fetchPermissionsForNewRole(): void {
    this.roleService.getPermissionsForNewRole().subscribe(
      (permissions) => {
        console.log('Raw API Response2:', permissions);
        this.permissions = permissions.map((permission) => ({
          label: permission.name,
          value: permission.description,
          sno: permission.sno,
          description: permission.description,
          activeStatus: permission.activeStatus,
          selected: false, // Initially set to false for new role
        }));
        this.selectedPermissions = []; // Reset selected permissions for new role
      },
      (error) => {
        this.handleError(error, 'Error fetching permissions for new role.');
      }
    );
  }

  fetchPermissionsForRole(rolePermissionId: number): void {
    this.roleService.getPermissionsForRole(rolePermissionId).subscribe(
      (permissions) => {
        console.log('Raw API Response:', permissions);

        this.permissions = permissions.map((permission) => ({
          label: permission.name,
          value: permission.description, // Use description consistently
          sno: permission.sno,
          description: permission.description,
          activeStatus: permission.activeStatus,
          selected: permission.isPermitted,
        }));

        this.selectedPermissions = this.permissions
          .filter((permission) => permission.selected)
          .map((permission) => permission.description);

        this.updatePermissionSelection();
      },
      (error) => {
        this.handleError(error, 'Error fetching permissions for the selected role.');
      }
    );
  }

  togglePermission(event: any, permission: any) {
    // Update the permission's selected state based on the checkbox
    const isChecked = event.target.checked;

    // Directly modify the selected state of the permission
    permission.selected = isChecked;

    // Update the selectedPermissions array based on the updated selected state of permissions
    this.selectedPermissions = this.permissions
      .filter((perm) => perm.selected) // Include only selected permissions
      .map((perm) => perm.description);     // Extract the permission values
  }


  isSubmitting = false;
  saveRolePermission(event: Event): void {
    this.isSubmitting = true;
    event.preventDefault();
    if (this.rolePermissionId === 0) {
      // If the rolePermissionId is 0, it means we are creating a new role
      this.addRole(event);
    } else {
      // If rolePermissionId is not 0, it means we are updating an existing role's permissions
      this.updatePermissions(event);
    }
  }

  addRole(event: Event): void {
    event.preventDefault();
    this.isSubmitting = true;

    // Fetch permissions first using the service
    this.roleService.getPermissionsForNewRole().subscribe(
      (permissions) => {
        const rolePermission = permissions.map(perm => ({
          sno: perm.sno,
          name: perm.name,
          description: perm.description,
          activeStatus: perm.activeStatus,
          isPermitted: this.selectedPermissions.includes(perm.description),
        }));
        console.log('role permissions', rolePermission);
        // Call the service to add the role permissions
        this.roleService.addRolePermissions(this.rolePermissionName, rolePermission).subscribe(
          (response) => {
            console.log('Role permission added successfully', response);
            this.closeDialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Role permission added successfully.',
            });
            this.holidayService.triggerRefresh();
            this.isSubmitting = false;
            // this.loadRolePermissions();
          },
          (error) => {
            this.isSubmitting = false;
            this.handleError(error, 'Failed to add role permission.');

          }
        );
      },
      (error) => {
        console.error('Failed to fetch permissions:', error);
        this.handleError(error, 'Failed to fetch permissions.');
      }
    );
  }

  updatePermissions(event: Event): void {
    event.preventDefault();
    this.isSubmitting = true;
    if (this.rolePermissionId === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Role Permission ID is required to update permissions.'
      });
      return; // Exit the method if the ID is null
    }

    const updatedPermissions = this.permissions.map((permission) => ({
      sno: permission.sno,
      name: permission.label,
      description: permission.description,
      // activeStatus: permission.activeStatus,
      isPermitted: this.selectedPermissions.includes(permission.description),
    }));

    console.log(updatedPermissions);

    // Call the service to update the permissions for the selected role
    this.roleService.updateRolePermissions(this.rolePermissionId, updatedPermissions).subscribe(
      (response) => {
        console.log('Permissions updated successfully', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Permissions updated successfully.',
        });
        this.holidayService.triggerRefresh();
        this.isSubmitting = false;
        this.closeDialog();

        if (this.rolePermissionId !== null) {
          this.fetchPermissionsForRole(this.rolePermissionId);
        }

      },
      (error) => {
        this.isSubmitting = false;
        this.handleError(error, 'Failed to update permissions.');

      }
    );
  }


  // Retry queued save requests periodically

  closeDialog(): void {
    this.isDialogVisible = false;
  }

  updatePermissionSelection(): void {
    this.permissions.forEach((permission) => {
      permission.selected = this.selectedPermissions.includes(permission.description);
    });
  }

  resetPermissionSelection(): void {
    this.permissions.forEach((permission) => (permission.selected = false));
  }

  ngOnDestroy(): void {
    clearInterval(this.retryInterval); // Stop retrying when component is destroyed
  }
  clearRolePermission(): void {
    this.selectedRolePermission = null;
  }


}

