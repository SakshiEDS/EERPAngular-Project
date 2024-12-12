import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { LoginComponent } from '../components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private dialogService: DialogService) { }

  openLoginDialog(): void {
    this.dialogService.open(LoginComponent, {
      header: 'Session Expired',
      width: '400px',
      closeOnEscape: false, // Optional: Prevent closing until login succeeds
      dismissableMask: true // Optional: Click outside to close the dialog
    });
  }
}
