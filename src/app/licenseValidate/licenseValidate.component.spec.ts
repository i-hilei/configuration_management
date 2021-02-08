import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LicenseValidateComponent } from './licenseValidate.component';

describe('LicenseValidateComponent', () => {
  let component: LicenseValidateComponent;
  let fixture: ComponentFixture<LicenseValidateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
