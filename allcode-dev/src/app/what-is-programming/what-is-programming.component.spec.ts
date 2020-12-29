import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatIsProgrammingComponent } from './what-is-programming.component';

describe('WhatIsProgrammingComponent', () => {
  let component: WhatIsProgrammingComponent;
  let fixture: ComponentFixture<WhatIsProgrammingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatIsProgrammingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatIsProgrammingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
