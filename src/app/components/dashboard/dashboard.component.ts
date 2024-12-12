import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    // BrowserModule,
    // BrowserAnimationsModule,
    TableModule,
    ChartModule, ButtonModule
  ],
})
export class DashboardComponent {
  public pieChartOptions!: ChartOptions;
  public pieChartData: ChartData<'pie'> | undefined;
  public pieChartType: ChartType = 'pie';
  employeeData = [
    { id: 101, name: 'John Doe', inTime: '09:10 AM', outTime: '06:05 PM', status: 'Present' },
    { id: 102, name: 'Jane Smith', inTime: '09:30 AM', outTime: '06:45 PM', status: 'Present' },
    { id: 103, name: 'Mark Lee', inTime: '10:00 AM', outTime: '05:30 PM', status: 'Absent' },
    // Add more employees if needed
  ];

  // Chart data for Average In-Time and Average Out-Time combined into one dataset
  chartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], // Days of the week as x-axis
    datasets: [
      {
        label: 'Average In-Time',
        data: [9.2, 9.1, 9.4, 9.0, 9.3], // Average In-Time data (in hours)
        borderColor: '#42A5F5', // Line color for In-Time
        fill: false, // No fill for this line
        tension: 0.4 // Smooth curve for the line
      },
      {
        label: 'Average Out-Time',
        data: [18.1, 18.3, 18.0, 18.2, 18.5], // Average Out-Time data (in hours)
        borderColor: '#FFA726', // Line color for Out-Time
        fill: false, // No fill for this line
        tension: 0.4 // Smooth curve for the line
      }
    ]
  };

  // Chart options
  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw} hrs`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number) {
            return value + ' hrs'; // Add 'hrs' to the y-axis labels
          }
        }
      }
    }
  }

  ngOnInit(): void {
    // Mock data for employee presence for a month
    const totalEmployees = 100;  // Example: Total number of employees
    const presentDays = 70;      // Example: Number of days employees were present
    const absentDays = 30;       // Example: Number of days employees were absent

    // Chart data for pie chart (present vs absent)
    this.pieChartData = {
      labels: ['Present', 'Absent'],  // Labels for each slice
      datasets: [
        {
          data: [presentDays, absentDays], // Data values for Present and Absent
          backgroundColor: ['#42A5F5', '#FF7043'], // Slice colors
        }
      ]
    };

    // Pie chart options
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `Days: ${context.raw}`,
          },
        },
      }
    };
  }
}