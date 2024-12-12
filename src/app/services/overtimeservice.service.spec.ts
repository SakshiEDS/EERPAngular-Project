import { TestBed } from '@angular/core/testing';

import { OvertimeserviceService } from './overtimeservice.service';

describe('OvertimeserviceService', () => {
  let service: OvertimeserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvertimeserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
