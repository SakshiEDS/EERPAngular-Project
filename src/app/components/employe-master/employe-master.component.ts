import { Component, OnInit } from '@angular/core';


interface Employee {
  sNo: number;
  code: string;
  name: string;
  department: string;
  designation: string;
  joiningDate: string;
  leavingDate?: string;
}

@Component({
  selector: 'app-employe-master',
  templateUrl: './employe-master.component.html',
  styleUrls: ['./employe-master.component.scss'],  // Corrected this line
})
export class EmployeMasterComponent implements OnInit {
  employees: Employee[] = [
    {
      sNo: 1,
      code: 'New000001',
      name: 'Amit Kumar',
      department: 'Software',
      designation: 'Engineer',
      joiningDate: '17/10/2024'
    },
    {
      sNo: 2,
      code: 'Software000001',
      name: 'Sakshi',
      department: 'Software',
      designation: 'Engineer',
      joiningDate: '01/07/2024',
      leavingDate: '29/10/2024'
    }
  ];

  ngOnInit() {
  }
}
