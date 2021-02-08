import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EnvironmentsListComponent } from './environments-list.component';

describe('EnvironmentsListComponent', () => {
  let component: EnvironmentsListComponent;
  let fixture: ComponentFixture<EnvironmentsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
