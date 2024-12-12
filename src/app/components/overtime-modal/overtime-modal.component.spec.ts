import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeModalComponent } from './overtime-modal.component';

describe('OvertimeModalComponent', () => {
  let component: OvertimeModalComponent;
  let fixture: ComponentFixture<OvertimeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OvertimeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
