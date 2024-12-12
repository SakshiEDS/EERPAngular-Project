import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpremarkComponent } from './empremark.component';

describe('EmpremarkComponent', () => {
  let component: EmpremarkComponent;
  let fixture: ComponentFixture<EmpremarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpremarkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpremarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
