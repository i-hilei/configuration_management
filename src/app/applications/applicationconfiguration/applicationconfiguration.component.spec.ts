import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicationconfigurationComponent } from './applicationconfiguration.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('ApplicationconfigurationComponent', () => {
  let component: ApplicationconfigurationComponent;
  let fixture: ComponentFixture<ApplicationconfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationconfigurationComponent ],
      schemas: [NO_ERRORS_SCHEMA]    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
