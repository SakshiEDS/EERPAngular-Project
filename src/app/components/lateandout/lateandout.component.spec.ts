import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateandoutComponent } from './lateandout.component';

describe('LateandoutComponent', () => {
  let component: LateandoutComponent;
  let fixture: ComponentFixture<LateandoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LateandoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LateandoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
