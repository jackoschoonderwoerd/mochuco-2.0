import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrefaceComponent } from './add-preface.component';

describe('AddPrefaceComponent', () => {
  let component: AddPrefaceComponent;
  let fixture: ComponentFixture<AddPrefaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrefaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPrefaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
