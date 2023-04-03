import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueNameComponent } from './venue-name.component';

describe('VenueNameComponent', () => {
  let component: VenueNameComponent;
  let fixture: ComponentFixture<VenueNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenueNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenueNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
