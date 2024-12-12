import { Component } from '@angular/core';
import { Carousel } from 'primeng/carousel';

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MenubarModule,
    ButtonModule,
    CarouselModule,
    CommonModule
  ]


})
export class RegistrationComponent {
  constructor(private router: Router, private http: HttpClient) {
    console.log('RegistrationComponent loaded');
  }

  data: any[] = []; // Store the subscription data
  permissions: any[] = [];
  onSignIn() {
    // Navigate to the Sign In page or handle Sign In logic
    this.router.navigate(['/login']);
  }

  onSignUp() {
    // Navigate to the Sign Up page or handle Sign Up logic
    this.router.navigate(['/organisation']);
  }
  isAccordionOpen = true;

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  carouselImages: string[] = [
    "assets/images/erp2.avif",
    "assets/images/erp3.avif",
    "assets/images/erp4.avif",

  ];

  carouselItems = [
    {
      image: 'https://images.unsplash.com/photo-1617304817446-5c4ae1ba7a98', // Business management concept
      title: 'Efficient ERP Solutions',
      description: 'Manage your business seamlessly with our ERP system.'
    },
    {
      image: 'https://images.unsplash.com/photo-1556742043-908ecf5f6f5f', // Productivity and teamwork
      title: 'Boost Productivity',
      description: 'Streamline your processes and increase efficiency.'
    },
    {
      image: 'https://images.unsplash.com/photo-1556157382-97edaed712d9', // Cloud computing and data access
      title: 'Cloud Integration',
      description: 'Access your data from anywhere, anytime.'
    }
  ];
  features = [
    {
      title: 'Comprehensive Dashboard',
      description: 'Get real-time insights and analytics to make informed decisions.'
    },
    {
      title: 'Customizable Modules',
      description: 'Tailor the ERP to suit your unique business needs.'
    },
    {
      title: '24/7 Support',
      description: 'Our support team is here to help you whenever needed.'
    },
    {
      title: 'Attendance Management',
      description: 'Track employee attendance, work hours, and absenteeism with ease. Ensure accuracy and compliance with your attendance policies.'
    },
    {
      title: 'Leave Management',
      description: 'Manage employee leave requests, approvals, and balances efficiently. Streamline the process with automatic leave tracking.'
    },
    {
      title: 'Employee Detail Management',
      description: 'Maintain a centralized repository for employee data, including personal details, roles, and work history, accessible anytime.'
    }
  ];




  fetchPermissions(): void {
    this.http
      .get<any[]>('http://localhost:5020/api/OrganisationSubscriptionPermissions/AllRoles')
      .subscribe((response) => {
        this.data = response;
        this.flattenPermissions();
      });
  }

  // Flatten permissions for rendering
  flattenPermissions(): void {
    this.permissions = this.data.flatMap((subscription) => subscription.permissions);
  }

  // Handle permission checkbox change
  onPermissionChange(permission: any): void {
    permission.activeStatus = !permission.activeStatus;
    console.log('Permission updated:', permission);
  }


  ngOnInit(): void {
    this.fetchPermissions();
  }
}



