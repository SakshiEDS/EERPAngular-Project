import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

interface ColorScheme {
  name: string;
  colors: { [key: string]: string };
}

interface TopNavbarColor {
  name: string;
  colors: { [key: string]: string };
}

interface SectionTitleNav {
  name: string;
  colors: { [key: string]: string };
}

interface TableHeaderColor {
  name: string;
  colors: { [key: string]: string };
}

interface ModalHeader {
  name: string;
  colors: { [key: string]: string };
}


interface SubmitBtn {
  name: string;
  colors: { [key: string]: string };
}

interface ExitBtn {
  name: string;
  colors: { [key: string]: string };
}

interface CreateBtn {
  name: string;
  colors: { [key: string]: string };
}


interface TableSubmitBtn {
  name: string;
  colors: { [key: string]: string };
}

@Component({
  selector: 'app-sidebar-color',
  templateUrl: './sidebar-color.component.html',
  styleUrl: './sidebar-color.component.scss',

  standalone: true,
  imports: [SidebarModule, ButtonModule, CommonModule],
})
export class SidebarColorComponent {

  sidebarVisible2: boolean = false;

  colorSchemes: ColorScheme[] = [
    {
      name: 'Default', colors: {
        '--main-background-color': '#164e7f',
        '--main-color': '#ffff',
      }
    },
    {
      name: 'Dark Mode', colors: {
        '--main-background-color': '#333333',
        '--main-color': '#ffffff',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--main-background-color': '#f4f4f4',
        '--main-color': '#0000',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--main-background-color': 'green',
        '--main-color': '#0000',
      }
    }
  ];


  TopNavbarColors: TopNavbarColor[] = [
    {
      name: 'Default', colors: {
        '--navbar-background-color': '#18558a',
        '--navbar-color': 'white',
      }
    },
    {
      name: 'Dark Mode', colors: {
        '--navbar-background-color': '#000000',
        '--navbar-color': '#ffffff',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--navbar-background-color': '#ffffff',
        '--navbar-color': '#333333',
      }
    },
    {
      name: 'green', colors: {
        '--navbar-background-color': 'green',
        '--navbar-color': '#333333',
      }
    }
  ];



  SectionTitleNavs: SectionTitleNav[] = [
    {
      name: 'Default', colors: {
        '--SectionTitleNav-background-color': '#18558a',
        '--SectionTitleNav-color': 'white',
      },
    },
    {
      name: 'Dark Mode', colors: {
        '--SectionTitleNav-background-color': '#000000',
        '--SectionTitleNav-color': '#ffffff',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--SectionTitleNav-background-color': '#ffffff',
        '--SectionTitleNav-color': '#333333',
      }
    },
    {
      name: 'green Mode', colors: {
        '--SectionTitleNav-background-color': 'green',
        '--SectionTitleNav-color': '#ffff',
      }
    }
  ];



  TableHeaderColors: TableHeaderColor[] = [
    {
      name: 'Default', colors: {
        '--TableTop-background-color': '#18558a',
        '--TableTop-color': 'white',
      },
    },
    {
      name: 'Dark Mode', colors: {
        '--TableTop-background-color': '#000000',
        '--TableTop-color': '#ffffff',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--TableTop-background-color': '#ffffff',
        '--TableTop-color': '#333333',
      }
    },
    {
      name: 'green Mode', colors: {
        '--TableTop-background-color': 'green',
        '--TableTop-color': '#ffff',
      }
    }
  ];





  ModalHeaders: ModalHeader[] = [
    {
      name: 'Default', colors: {
        '--ModalHeaders-background-color': '#18558a',
        '--ModalHeaders-color': 'white',
      },
    },
    {
      name: 'Dark Mode', colors: {
        '--ModalHeaders-background-color': '#000000',
        '--ModalHeaders-color': '#ffffff',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--ModalHeaders-background-color': '#ffffff',
        '--ModalHeaders-color': '#333333',
      }
    },
    {
      name: 'green Mode', colors: {
        '--ModalHeaders-background-color': 'green',
        '--ModalHeaders-color': '#ffff',
      }
    }
  ];


  SubmitBtns: SubmitBtn[] = [
    {
      name: 'Default', colors: {
        '--ModalSubmitBtn-background-color': '#18558a',
        '--ModalSubmitBtn-color': 'white',
      },
    },
    {
      name: 'Dark Mode', colors: {
        '--ModalSubmitBtn-background-color': '#000000',
        '--ModalSubmitBtn-color': '#ffffff',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--ModalSubmitBtn-background-color': '#ffffff',
        '--ModalSubmitBtn-color': '#333333',
      }
    },
    {
      name: 'green Mode', colors: {
        '--ModalSubmitBtn-background-color': 'green',
        '--ModalSubmitBtn-color': '#ffff',
      }
    }
  ];


  ExitBtns: ExitBtn[] = [
    {
      name: 'Default', colors: {
        '--ModalExitBtn-background-color': 'gray',
        '--ModalExitBtn-color': 'white',
      },
    },
    {
      name: 'Dark Mode', colors: {
        '--ModalExitBtn-background-color': '#000000',
        '--ModalExitBtn-color': '#ffffff',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--ModalExitBtn-background-color': '#ffffff',
        '--ModalExitBtn-color': '#333333',
      }
    },
    {
      name: 'green Mode', colors: {
        '--ModalExitBtn-background-color': 'green',
        '--ModalExitBtn-color': '#ffff',
      }
    }
  ];

  CreateBtns: CreateBtn[] = [
    {
      name: 'Default', colors: {
        '--CreateBtn-background-color': '#18558a',
        '--CreateBtn-color': 'white',
      },
    },
    {
      name: 'Dark Mode', colors: {
        '--CreateBtn-background-color': '#000000',
        '--CreateBtn-color': '#ffffff',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--CreateBtn-background-color': '#ffffff',
        '--CreateBtn-color': '#333333',
      }
    },
    {
      name: 'green Mode', colors: {
        '--CreateBtn-background-color': 'green',
        '--CreateBtn-color': '#ffff',
      }
    }
  ];



  TableSubmitBtns: TableSubmitBtn[] = [
    {
      name: 'Default', colors: {
        '--TableSubmitBtn-background-color': 'green',
        '--TableSubmitBtn-color': 'white',
      },
    },
    {
      name: 'Dark Mode', colors: {
        '--TableSubmitBtn-background-color': '#000000',
        '--TableSubmitBtn-color': '#ffffff',
      }
    },
    {
      name: 'Light Mode', colors: {
        '--TableSubmitBtn-background-color': '#ffffff',
        '--TableSubmitBtn-color': '#333333',
      }
    },
    {
      name: 'Blue Mode', colors: {
        '--TableSubmitBtn-background-color': '#18558a',
        '--TableSubmitBtn-color': '#ffff',
      }
    }
  ];






  // Function to toggle the sidebar
  toggleSidebar(position: string): void {
    switch (position) {
      case 'right':
        this.sidebarVisible2 = !this.sidebarVisible2;
        break;
    }
  }

  // Function to change color scheme
  ngOnInit(): void {
    this.loadTopNavColor(); // Load top navbar colors on page load
    this.loadColorScheme();
    this.applySectionTitleNavFromStorage();
    this.applyTableHeaderColorFromStorage();
    this.applyModalHeaderColorFromStorage();
    this.applySubmitBtnColorFromStorage();
    this.applyExitBtnColorFromStorage();
    this.applyCreateBtnColorFromStorage();
  }

  changeColorScheme(colorScheme: ColorScheme): void {
    for (const key in colorScheme.colors) {
      if (colorScheme.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, colorScheme.colors[key]);
      }
    }
    localStorage.setItem('selectedColorScheme', JSON.stringify(colorScheme));
  }

  loadColorScheme(): void {
    const savedColorScheme = localStorage.getItem('selectedColorScheme');
    if (savedColorScheme) {
      const colorScheme: ColorScheme = JSON.parse(savedColorScheme);
      this.applyColorScheme(colorScheme);
    }
  }

  applyColorScheme(colorScheme: ColorScheme): void {
    for (const key in colorScheme.colors) {
      document.documentElement.style.setProperty(key, colorScheme.colors[key]);
    }
  }

  resetToDefault(): void {
    const defaultScheme = this.colorSchemes.find(scheme => scheme.name === 'Default');
    if (defaultScheme) {
      this.changeColorScheme(defaultScheme);
    }
  }


  // Changge top nav bar color 
  ChangeTopNavColor(topNavbarColors: TopNavbarColor): void {
    for (const key in topNavbarColors.colors) {
      if (topNavbarColors.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, topNavbarColors.colors[key]);
      }
    }
    localStorage.setItem('selectedTopNavColor', JSON.stringify(topNavbarColors));
  }

  loadTopNavColor(): void {
    const savedTopNavColor = localStorage.getItem('selectedTopNavColor');
    if (savedTopNavColor) {
      const topNavbarColors: TopNavbarColor = JSON.parse(savedTopNavColor);
      this.applyTopNavColor(topNavbarColors);
    }
  }

  applyTopNavColor(topNavbarColors: TopNavbarColor): void {
    for (const key in topNavbarColors.colors) {
      if (topNavbarColors.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, topNavbarColors.colors[key]);
      }
    }
  }

  TopNavToDefault(): void {
    const defaultScheme = this.TopNavbarColors.find(scheme => scheme.name === 'Default');
    if (defaultScheme) {
      this.changeColorScheme(defaultScheme);

      // Remove the saved color scheme from localStorage
      localStorage.removeItem('selectedColorScheme');
    }
  }



  // Section title Nav 
  SectionTitleNav(sectionTitleNav: SectionTitleNav): void {
    for (const key in sectionTitleNav.colors) {
      if (sectionTitleNav.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, sectionTitleNav.colors[key]);
      }
    }
    localStorage.setItem('selectedSectionTitleNav', JSON.stringify(sectionTitleNav));
  }

  applySectionTitleNavFromStorage(): void {
    const storedSectionTitleNav = localStorage.getItem('selectedSectionTitleNav');
    if (storedSectionTitleNav) {
      const sectionTitleNav = JSON.parse(storedSectionTitleNav) as SectionTitleNav;
      this.SectionTitleNav(sectionTitleNav);
    }
  }

  // Reset SectionTitleNav to default
  resetSectionTitleNavToDefault(): void {
    const defaultScheme = this.SectionTitleNavs.find(scheme => scheme.name === 'Default');
    if (defaultScheme) {
      this.SectionTitleNav(defaultScheme);
    }
  }

  // Table headers 
  TableHeaderColor(tableHeaderColor: TableHeaderColor): void {
    for (const key in tableHeaderColor.colors) {
      if (tableHeaderColor.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, tableHeaderColor.colors[key]);
      }
    }
    localStorage.setItem('selectedTableHeaderColor', JSON.stringify(tableHeaderColor));
  }

  applyTableHeaderColorFromStorage(): void {
    const storedTableHeaderColor = localStorage.getItem('selectedTableHeaderColor');
    if (storedTableHeaderColor) {
      const tableHeaderColor = JSON.parse(storedTableHeaderColor) as TableHeaderColor;
      this.TableHeaderColor(tableHeaderColor);
    }
  }

  resetTableHeaderToDefault(): void {
    const defaultScheme = this.TableHeaderColors.find(scheme => scheme.name === 'Default');
    if (defaultScheme) {
      this.TableHeaderColor(defaultScheme);
    }
  }

  // Modal Headers 
  ModalHeaderColor(modalHeader: ModalHeader): void {
    for (const key in modalHeader.colors) {
      if (modalHeader.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, modalHeader.colors[key]);
      }
    }
    localStorage.setItem('selectedModalHeaderColor', JSON.stringify(modalHeader));
  }

  // Apply saved ModalHeader colors from local storage
  applyModalHeaderColorFromStorage(): void {
    const storedModalHeaderColor = localStorage.getItem('selectedModalHeaderColor');
    if (storedModalHeaderColor) {
      const modalHeader = JSON.parse(storedModalHeaderColor) as ModalHeader;
      this.ModalHeaderColor(modalHeader);
    }
  }

  resetModalHeaderToDefault(): void {
    const defaultScheme = this.ModalHeaders.find(scheme => scheme.name === 'Default');
    if (defaultScheme) {
      this.ModalHeaderColor(defaultScheme);
    }
  }

  // Modal submit buttons 
  SubmitBtnColor(submitBtn: SubmitBtn): void {
    for (const key in submitBtn.colors) {
      if (submitBtn.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, submitBtn.colors[key]);
      }
    }
    localStorage.setItem('selectedSubmitBtnColor', JSON.stringify(submitBtn));
  }

  applySubmitBtnColorFromStorage(): void {
    const storedSubmitBtnColor = localStorage.getItem('selectedSubmitBtnColor');
    if (storedSubmitBtnColor) {
      const submitBtn = JSON.parse(storedSubmitBtnColor) as SubmitBtn;
      this.SubmitBtnColor(submitBtn);
    }
  }

  resetSubmitBtnToDefault(): void {
    const defaultScheme = this.SubmitBtns.find(scheme => scheme.name === 'Default');
    if (defaultScheme) {
      this.SubmitBtnColor(defaultScheme);
    }
  }

  // Modal exit buttons 
  ExitBtnColor(exitBtn: ExitBtn): void {
    for (const key in exitBtn.colors) {
      if (exitBtn.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, exitBtn.colors[key]);
      }
    }
    localStorage.setItem('selectedExitBtnColor', JSON.stringify(exitBtn));
  }

  applyExitBtnColorFromStorage(): void {
    const storedExitBtnColor = localStorage.getItem('selectedExitBtnColor');
    if (storedExitBtnColor) {
      const exitBtn = JSON.parse(storedExitBtnColor) as ExitBtn;
      this.ExitBtnColor(exitBtn);
    }
  }

  resetExitBtnToDefault(): void {
    const defaultScheme = this.ExitBtns.find(scheme => scheme.name === 'Default');
    if (defaultScheme) {
      this.ExitBtnColor(defaultScheme);
    }
    localStorage.removeItem('selectedExitBtnColor');
  }


  // Create table buttons 
  ModalCreateBtnColor(createBtn: CreateBtn): void {
    for (const key in createBtn.colors) {
      if (createBtn.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, createBtn.colors[key]);
      }
    }
    localStorage.setItem('selectedCreateBtnColor', JSON.stringify(createBtn));
  }

  applyCreateBtnColorFromStorage(): void {
    const storedCreateBtnColor = localStorage.getItem('selectedCreateBtnColor');
    if (storedCreateBtnColor) {
      const createBtn = JSON.parse(storedCreateBtnColor) as CreateBtn;
      this.ModalCreateBtnColor(createBtn);
    }
  }
  resetCreateBtnToDefault(): void {
    const defaultScheme = this.CreateBtns.find(scheme => scheme.name === 'Default');
    if (defaultScheme) {
      this.ModalCreateBtnColor(defaultScheme);
    }

    const storedColor = localStorage.getItem('selectedCreateBtnColor');
    if (storedColor) {
      localStorage.removeItem('selectedCreateBtnColor');
    }
  }


  // Table submit  button 
  TableSubmitBtnColor(tableSubmitBtn: TableSubmitBtn): void {
    for (const key in tableSubmitBtn.colors) {
      if (tableSubmitBtn.colors.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, tableSubmitBtn.colors[key]);
      }
    }
    localStorage.setItem('selectedTableSubmitBtnColor', JSON.stringify(tableSubmitBtn));
  }

  applyTableSubmitBtnColorFromStorage(): void {
    const storedTableSubmitBtnColor = localStorage.getItem('selectedTableSubmitBtnColor');
    if (storedTableSubmitBtnColor) {
      const tableSubmitBtn = JSON.parse(storedTableSubmitBtnColor) as TableSubmitBtn;
      this.TableSubmitBtnColor(tableSubmitBtn);
    }
  }

  resetTableSubmitBtnToDefault(): void {
    const defaultScheme = this.TableSubmitBtns.find(scheme => scheme.name === 'Default');
    if (defaultScheme) {
      this.TableSubmitBtnColor(defaultScheme);
    }

    const storedColor = localStorage.getItem('selectedTableSubmitBtnColor');
    if (storedColor) {
      localStorage.removeItem('selectedTableSubmitBtnColor');
    }
  }
}