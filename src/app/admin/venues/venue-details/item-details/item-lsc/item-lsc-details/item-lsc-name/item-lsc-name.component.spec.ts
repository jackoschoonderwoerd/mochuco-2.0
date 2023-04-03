import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLscNameComponent } from './item-lsc-name.component';

describe('ItemNameComponent', () => {
    let component: ItemLscNameComponent;
    let fixture: ComponentFixture<ItemLscNameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ItemLscNameComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ItemLscNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
