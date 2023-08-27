import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageOptionsDialogComponent } from './language-options-dialog.component';

describe('LanguageOptionsDialogComponent', () => {
  let component: LanguageOptionsDialogComponent;
  let fixture: ComponentFixture<LanguageOptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageOptionsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
