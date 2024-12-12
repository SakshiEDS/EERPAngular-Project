import { TestBed } from '@angular/core/testing';

import { LateoutService } from './lateout.service';

describe('LateoutService', () => {
  let service: LateoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LateoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
