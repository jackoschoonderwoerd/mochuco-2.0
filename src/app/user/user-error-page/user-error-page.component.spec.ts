import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserErrorPageComponent } from './user-error-page.component';

describe('UserErrorPageComponent', () => {
  let component: UserErrorPageComponent;
  let fixture: ComponentFixture<UserErrorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserErrorPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
