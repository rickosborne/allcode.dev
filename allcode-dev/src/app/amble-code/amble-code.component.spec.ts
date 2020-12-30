import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbleCodeComponent } from './amble-code.component';

describe('AmbleCodeComponent', () => {
  let component: AmbleCodeComponent;
  let fixture: ComponentFixture<AmbleCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbleCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbleCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
