import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLscAudioComponent } from './lsc-audio.component';

describe('ItemAudioComponent', () => {
    let component: ItemLscAudioComponent;
    let fixture: ComponentFixture<ItemLscAudioComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ItemLscAudioComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ItemLscAudioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
