import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoopBasicsComponent } from './loop-basics.component';

describe('LoopBasicsComponent', () => {
  let component: LoopBasicsComponent;
  let fixture: ComponentFixture<LoopBasicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoopBasicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
