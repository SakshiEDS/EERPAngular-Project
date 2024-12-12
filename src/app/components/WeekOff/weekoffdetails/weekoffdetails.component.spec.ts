import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekoffdetailsComponent } from './weekoffdetails.component';

describe('WeekoffdetailsComponent', () => {
  let component: WeekoffdetailsComponent;
  let fixture: ComponentFixture<WeekoffdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeekoffdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekoffdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
