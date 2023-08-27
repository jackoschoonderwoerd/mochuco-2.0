import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowStoreComponent } from './window-store.component';

describe('WindowStoreComponent', () => {
  let component: WindowStoreComponent;
  let fixture: ComponentFixture<WindowStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
