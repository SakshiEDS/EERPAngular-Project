import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndofserviceComponent } from './endofservice.component';

describe('EndofserviceComponent', () => {
  let component: EndofserviceComponent;
  let fixture: ComponentFixture<EndofserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndofserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndofserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
