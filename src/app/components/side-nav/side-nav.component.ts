import { Component, HostListener, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { navbarData } from './nav-data';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AttendanceCorrectionComponent } from "../Attendance-Section/attendance-correction/attendance-correction.component";
import { PermissionService } from '../../services/permission.service';
import { SidebarColorComponent } from "../sidebar-color/sidebar-color.component";
import { ButtonModule } from 'primeng/button';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  standalone: true,
  imports: [FormsModule, ListboxModule, RouterModule, CommonModule, AttendanceCorrectionComponent, SidebarColorComponent, ButtonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SideNavComponent implements OnInit {
  private permissionService: PermissionService;

  constructor(permissionService: PermissionService) {
    this.permissionService = permissionService;
  }

  // Getter method to access the permissionService
  public get permissionServiceInstance() {
    return this.permissionService;
  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  // constructor(private permissionService: PermissionService

  // ) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  filteredNavbarData: any[] = [];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if the clicked element is inside the dropdown
    const clickedInsideDropdown = target.closest('.sidenav-dropdown-btn') || target.closest('.sidenav-dropdown-menu');
    if (!clickedInsideDropdown) {
      this.isDropdownOpen = false; // Close the dropdown
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.filterNavbarItems();
  }
  filterNavbarItems(): void {
    console.log('Navbar Data:', navbarData);
    this.filteredNavbarData = navbarData.filter((item) => {
      // If the item requires a permission, check if the user has it
      if (item.requiredPermission) {
        console.log('Required Permission:', item.requiredPermission);
        return this.permissionService.hasPermission(item.requiredPermission);

      }
      console.log(this.filteredNavbarData);
      return true;  // If no specific permission is required, show the item
    });
  }
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  navbarData = navbarData;

  toggleExpand(item: any) {
    item.isOpen = !item.isOpen; // Toggle the 'isOpen' property to show/hide the list
  }

  isDropdownOpen = false;

  dropdownOptions = [
    {
      routeLink: 'holiday',
      label: 'Holiday',
      icon: 'fas fa-link',
      requiredPermission: 'Holiday',  // Add permission for the main option
      details: [
        { routeLink: '/route1/detail1', label: 'Detail 1', requiredPermission: 'Detail1Permission' },  // Add permission for each detail
        { routeLink: '/route1/detail2', label: 'Detail 2', requiredPermission: 'Detail2Permission' },
      ],
    },
    {
      routeLink: 'manage-users',
      label: 'Manage Users',
      icon: 'fas fa-link',
      requiredPermission: 'ManageUsersPermission',
      details: [
        { routeLink: '/route2/detail1', label: 'Detail A', requiredPermission: 'DetailAPermission' },
        { routeLink: '/route2/detail2', label: 'Detail B', requiredPermission: 'DetailBPermission' },
      ],
    },
    {
      routeLink: '/route3',
      label: 'Option 3',
      icon: 'fas fa-link',
      requiredPermission: 'Option3Permission',
      details: null
    },
  ];

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}