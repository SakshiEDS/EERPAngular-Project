import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private configs: { [key: string]: { apiUrl: string; label: string } } = {
    bank: { apiUrl: 'http://13.233.79.234:8080/api/Bank', label: 'Bank' },
    city: { apiUrl: 'http://13.233.79.234:8080/api/City', label: 'City' },
    state: { apiUrl: 'http://13.233.79.234:8080/api/StateDetails', label: 'State' },
    department: { apiUrl: 'http://13.233.79.234:8080/api/Department', label: 'Department' },
    designation: { apiUrl: 'http://13.233.79.234:8080/api/Designation', label: 'Designation' },
    lateIn: { apiUrl: 'http://13.233.79.234:8080/api/LateinRule', label: 'Late In' },
    reportingTo: { apiUrl: 'http://localhost:5020/api/EmpDetails', label: 'Reporting To' },
    shift: { apiUrl: 'http://13.233.79.234:8080/api/Shift', label: 'Shift' },
    out: { apiUrl: 'http://13.233.79.234:8080/api/EarlyOutRule', label: 'Early Out' },
    country: { apiUrl: 'http://13.233.79.234:8080/api/Country', label: 'Country' },
  };

  constructor() { }

  getContextConfig(context: string): { apiUrl: string; label: string } | undefined {
    return this.configs[context];
  }
}
