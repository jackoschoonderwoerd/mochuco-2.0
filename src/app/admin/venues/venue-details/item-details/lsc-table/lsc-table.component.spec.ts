import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LscTableComponent } from './lsc-table.component';

describe('LscTableComponent', () => {
  let component: LscTableComponent;
  let fixture: ComponentFixture<LscTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LscTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LscTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
