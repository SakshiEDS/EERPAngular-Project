import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeMasterComponent } from './components/employe-master/employe-master.component';

import { EmployeDetailModalComponent } from './components/employe-detail-modal/employe-detail-modal.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employe-master', component: EmployeMasterComponent },

  { path: 'employe-detail-modal', component: EmployeDetailModalComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
