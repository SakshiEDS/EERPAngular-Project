import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormfreetrialComponent } from './formfreetrial.component';

describe('FormfreetrialComponent', () => {
  let component: FormfreetrialComponent;
  let fixture: ComponentFixture<FormfreetrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormfreetrialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormfreetrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
