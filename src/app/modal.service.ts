// modal.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private showModalSource = new Subject<any>();
  showModal$ = this.showModalSource.asObservable();

  openModal(employeeData?: any) {
    this.showModalSource.next(employeeData);
  }
}
