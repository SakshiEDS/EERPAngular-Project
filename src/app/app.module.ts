import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BodyComponent } from './components/body/body.component';
import { EmployeMasterComponent } from './components/employe-master/employe-master.component';
import { EmployeDetailModalComponent } from "./components/employe-detail-modal/employe-detail-modal.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicComponent } from './components/dynamic/dynamic.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditComponent } from './components/edit/edit.component';
import { LateandoutComponent } from './components/lateandout/lateandout.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LeaveMasterService } from './services/leave-master.service';
import { LeaveMasterComponent } from './components/Leave-Sections/leave-master/leave-master.component';
import { LeaveAdjustmentComponent } from './components/Leave-Sections/leave-adjustment/leave-adjustment.component';
import { LeaveApplicationComponent } from './components/Leave-Sections/leave-application/leave-application.component';
import { LeaveEncashmentComponent } from './components/Leave-Sections/leave-encashment/leave-encashment.component';
import { CreateNewLeaveModalComponent } from './components/Leave-Sections/create-new-leave-modal/create-new-leave-modal.component';
import { EditLeaveComponent } from './components/edit-leave/edit-leave.component';
import { HolidayComponent } from './components/holiday/holiday.component';
import { HolidayTableComponent } from './components/holiday-table/holiday-table.component';
import { HolidayEditComponent } from './components/holiday-edit/holiday-edit.component';
import { LeaveTableComponent } from './components/Leave-Sections/leave-table/leave-table.component';
import { LeaveViewComponent } from './components/Leave-Sections/leave-view/leave-view.component';
import { LeaveHrapplyComponent } from './components/Leave-Sections/leave-hrapply/leave-hrapply.component';
import { AttendanceTableComponent } from './components/Attendance-Section/attendance-table/attendance-table.component';
import { EndofserviceComponent } from './components/endofservice/endofservice.component';
import { EmpremarkComponent } from './components/empremark/empremark.component';
import { WeekoffdetailsComponent } from './components/WeekOff/weekoffdetails/weekoffdetails.component';
import { FormfreetrialComponent } from './components/Form Sections/formfreetrial/formfreetrial.component';
import { AttendanceCorrectionComponent } from './components/Attendance-Section/attendance-correction/attendance-correction.component';
import { OvertimeModalComponent } from './components/overtime-modal/overtime-modal.component';
import { LoginComponent } from './components/login/login.component';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { AuthServiceService } from './services/auth-service.service';
import { CreateNewUsersModalComponent } from './components/ManageUsers/create-new-users-modal/create-new-users-modal.component';
import { UserManagementTableComponent } from './components/ManageUsers/user-management-table/user-management-table.component';
import { UserEditComponent } from './components/ManageUsers/user-edit/user-edit.component';
import { AddPermissionComponent } from './components/Permission-Section/add-permission/add-permission.component';
import { RolePermissionComponent } from './components/Permission-Section/role-permission/role-permission.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { RegistrationComponent } from './components/registration/registration.component';
import { SidebarColorComponent } from './components/sidebar-color/sidebar-color.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    AppComponent,


    BodyComponent,
    LoginComponent,
    ForgotpasswordComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EmployeDetailModalComponent,
    EmployeMasterComponent,
    ReactiveFormsModule,
    DynamicComponent,
    ConfirmDialogModule,
    EditComponent,
    LateandoutComponent,
    ToastrModule.forRoot(),
    LeaveAdjustmentComponent,
    LeaveApplicationComponent,
    LeaveEncashmentComponent,
    LeaveMasterComponent,
    EditLeaveComponent,
    HolidayComponent,
    HolidayTableComponent,
    HolidayEditComponent,
    LeaveTableComponent,
    LeaveViewComponent,
    LeaveHrapplyComponent,

    AttendanceTableComponent,
    EndofserviceComponent,
    EmpremarkComponent,
    WeekoffdetailsComponent,
    FormfreetrialComponent,
    AttendanceCorrectionComponent,
    SideNavComponent,
    OvertimeModalComponent,
    CardModule,
    PasswordModule,
    CreateNewUsersModalComponent,
    UserManagementTableComponent,
    UserEditComponent,
    AddPermissionComponent,
    RolePermissionComponent,
    MultiSelectModule,
    FormsModule,
    RegistrationComponent,
    SidebarColorComponent,
    DialogModule,
    DashboardComponent,


  ],
  providers: [MessageService, ConfirmationService, AuthServiceService, MultiSelectModule],
  bootstrap: [AppComponent]
})
export class AppModule { }