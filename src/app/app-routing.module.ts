import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeMasterComponent } from './components/employe-master/employe-master.component';

import { EmployeDetailModalComponent } from './components/employe-detail-modal/employe-detail-modal.component';
import { LeaveMasterComponent } from './components/Leave-Sections/leave-master/leave-master.component';
import { LeaveApplicationComponent } from './components/Leave-Sections/leave-application/leave-application.component';
import { LeaveAdjustmentComponent } from './components/Leave-Sections/leave-adjustment/leave-adjustment.component';
import { LeaveEncashmentComponent } from './components/Leave-Sections/leave-encashment/leave-encashment.component';
import { HolidayComponent } from './components/holiday/holiday.component';
import { HolidayTableComponent } from './components/holiday-table/holiday-table.component';
import { LeaveTableComponent } from './components/Leave-Sections/leave-table/leave-table.component';
import { LeaveHrapplyComponent } from './components/Leave-Sections/leave-hrapply/leave-hrapply.component';
import { AttendanceTableComponent } from './components/Attendance-Section/attendance-table/attendance-table.component';
import { EndofserviceComponent } from './components/endofservice/endofservice.component';
import { EmpremarkComponent } from './components/empremark/empremark.component';
import { WeekoffdetailsComponent } from './components/WeekOff/weekoffdetails/weekoffdetails.component';
import { FormfreetrialComponent } from './components/Form Sections/formfreetrial/formfreetrial.component';
import { AttendanceCorrectionComponent } from './components/Attendance-Section/attendance-correction/attendance-correction.component';
import { LoginComponent } from './components/login/login.component';
import { UserManagementTableComponent } from './components/ManageUsers/user-management-table/user-management-table.component';
import { AddPermissionComponent } from './components/Permission-Section/add-permission/add-permission.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: RegistrationComponent },
  { path: 'registration', component: RegistrationComponent },


  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'employe-master', component: EmployeMasterComponent, canActivate: [AuthGuard] },
  { path: 'employe-detail-modal', component: EmployeDetailModalComponent, canActivate: [AuthGuard] },
  { path: 'leave-master', component: LeaveMasterComponent, canActivate: [AuthGuard] },
  { path: 'leave-application', component: LeaveApplicationComponent, canActivate: [AuthGuard] },
  { path: 'leave-adjustment', component: LeaveAdjustmentComponent, canActivate: [AuthGuard] },
  { path: 'leave-encashment', component: LeaveEncashmentComponent, canActivate: [AuthGuard] },
  { path: 'holiday', component: HolidayTableComponent, canActivate: [AuthGuard] },
  { path: 'leave-table', component: LeaveTableComponent, canActivate: [AuthGuard] },
  { path: 'attendance-table', component: AttendanceTableComponent, canActivate: [AuthGuard] },
  { path: 'leave-hrapply', component: LeaveHrapplyComponent, canActivate: [AuthGuard] },
  { path: 'emp-remark', component: EmpremarkComponent, canActivate: [AuthGuard] },
  { path: 'empResignation', component: EndofserviceComponent, canActivate: [AuthGuard] },
  { path: 'attendance-correction', component: AttendanceCorrectionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'manage-users', component: UserManagementTableComponent, canActivate: [AuthGuard] },
  { path: 'add-permission', component: AddPermissionComponent, canActivate: [AuthGuard] },
  { path: 'organisation', component: FormfreetrialComponent },
  { path: 'weekoff', component: WeekoffdetailsComponent, canActivate: [AuthGuard] },
  { path: 'side-nav', component: SideNavComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuard] },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
