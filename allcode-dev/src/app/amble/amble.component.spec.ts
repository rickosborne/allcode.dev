import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbleComponent } from './amble.component';

describe('AmbleComponent', () => {
  let component: AmbleComponent;
  let fixture: ComponentFixture<AmbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
