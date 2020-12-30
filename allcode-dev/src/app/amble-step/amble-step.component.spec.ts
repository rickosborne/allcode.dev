import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbleStepComponent } from './amble-step.component';

describe('AmbleStepComponent', () => {
  let component: AmbleStepComponent;
  let fixture: ComponentFixture<AmbleStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbleStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbleStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
