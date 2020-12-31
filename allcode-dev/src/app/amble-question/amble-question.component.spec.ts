import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbleQuestionComponent } from './amble-question.component';

describe('AmbleQuestionComponent', () => {
  let component: AmbleQuestionComponent;
  let fixture: ComponentFixture<AmbleQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbleQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbleQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
