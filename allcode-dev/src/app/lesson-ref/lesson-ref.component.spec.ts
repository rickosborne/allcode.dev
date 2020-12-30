import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonRefComponent } from './lesson-ref.component';

describe('LessonRefComponent', () => {
  let component: LessonRefComponent;
  let fixture: ComponentFixture<LessonRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonRefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
