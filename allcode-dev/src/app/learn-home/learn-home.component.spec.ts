import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnHomeComponent } from './learn-home.component';

describe('LearnHomeComponent', () => {
  let component: LearnHomeComponent;
  let fixture: ComponentFixture<LearnHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
