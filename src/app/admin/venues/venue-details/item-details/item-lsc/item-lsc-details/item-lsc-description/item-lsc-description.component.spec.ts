import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLscDescriptionComponent } from './item-lsc-description.component';

describe('ItemLscDescriptionComponent', () => {
    let component: ItemLscDescriptionComponent;
    let fixture: ComponentFixture<ItemLscDescriptionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ItemLscDescriptionComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ItemLscDescriptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
