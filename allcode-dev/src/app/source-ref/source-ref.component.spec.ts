import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceRefComponent } from './source-ref.component';

describe('SourceRefComponent', () => {
  let component: SourceRefComponent;
  let fixture: ComponentFixture<SourceRefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceRefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
