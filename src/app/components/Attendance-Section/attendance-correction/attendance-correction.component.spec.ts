import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceCorrectionComponent } from './attendance-correction.component';

describe('AttendanceCorrectionComponent', () => {
  let component: AttendanceCorrectionComponent;
  let fixture: ComponentFixture<AttendanceCorrectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendanceCorrectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
