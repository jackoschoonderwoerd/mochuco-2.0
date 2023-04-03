import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFooterComponent } from './item-footer.component';

describe('ItemFooterComponent', () => {
  let component: ItemFooterComponent;
  let fixture: ComponentFixture<ItemFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
