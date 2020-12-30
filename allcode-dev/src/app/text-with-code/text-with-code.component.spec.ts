import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextWithCodeComponent } from './text-with-code.component';

describe('TextWithCodeComponent', () => {
  let component: TextWithCodeComponent;
  let fixture: ComponentFixture<TextWithCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextWithCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextWithCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
