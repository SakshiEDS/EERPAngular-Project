import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveHrapplyComponent } from './leave-hrapply.component';

describe('LeaveHrapplyComponent', () => {
  let component: LeaveHrapplyComponent;
  let fixture: ComponentFixture<LeaveHrapplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveHrapplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveHrapplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
