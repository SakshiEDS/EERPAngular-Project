import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';  // To support ngModel binding
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BodyComponent } from './components/body/body.component';
// import { EmployeMasterComponent } from './components/employe-master/employe-master.component';
// import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EmployeDetailModalComponent } from './components/employe-detail-modal/employe-detail-modal.component';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

// import { TableCustomersDemoComponent } from './components/table-customers-demo/table-customers-demo.component'; import { EmployeeMasterComponent } from './components/employe-master/employe-master.component';
import { ToolbarModule } from 'primeng/toolbar';
import { EmployeMasterComponent } from './components/employe-master/employe-master.component';
import { ReactiveFormsModule } from '@angular/forms';





@NgModule({
  declarations: [
    AppComponent,

    SideNavComponent,
    DashboardComponent,
    BodyComponent,


    // SidebarComponent,


    EmployeMasterComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    DialogModule,
    EmployeDetailModalComponent,
    BrowserAnimationsModule,
    FormsModule,  // Make sure you have FormsModule for ngModel
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    TableModule,
    InputNumberModule,
    CommonModule,
    HttpClientModule,
    ToolbarModule,
    ReactiveFormsModule




  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
