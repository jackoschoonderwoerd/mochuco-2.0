import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LscDescriptionComponent } from './lsc-description.component';

describe('LscDescriptionComponent', () => {
    let component: LscDescriptionComponent;
    let fixture: ComponentFixture<LscDescriptionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LscDescriptionComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LscDescriptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
