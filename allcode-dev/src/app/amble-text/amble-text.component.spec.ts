import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbleTextComponent } from './amble-text.component';

describe('AmbleTextComponent', () => {
  let component: AmbleTextComponent;
  let fixture: ComponentFixture<AmbleTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbleTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbleTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
