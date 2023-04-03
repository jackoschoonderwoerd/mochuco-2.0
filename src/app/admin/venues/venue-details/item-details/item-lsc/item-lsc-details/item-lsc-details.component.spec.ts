import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLscDetailsComponent } from './item-lsc-details.component';

describe('ItemLscDetailsComponent', () => {
  let component: ItemLscDetailsComponent;
  let fixture: ComponentFixture<ItemLscDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemLscDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemLscDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
