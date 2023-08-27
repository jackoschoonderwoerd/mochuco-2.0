import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LscNameComponent } from './lsc-name.component';

describe('ItemNameComponent', () => {
    let component: LscNameComponent;
    let fixture: ComponentFixture<LscNameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LscNameComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LscNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
