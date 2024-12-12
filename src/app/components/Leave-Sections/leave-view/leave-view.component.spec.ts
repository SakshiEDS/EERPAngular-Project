import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveViewComponent } from './leave-view.component';

describe('LeaveViewComponent', () => {
  let component: LeaveViewComponent;
  let fixture: ComponentFixture<LeaveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
