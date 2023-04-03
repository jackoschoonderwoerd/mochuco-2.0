import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLscComponent } from './item-lsc.component';

describe('ItemLscComponent', () => {
  let component: ItemLscComponent;
  let fixture: ComponentFixture<ItemLscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemLscComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemLscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
