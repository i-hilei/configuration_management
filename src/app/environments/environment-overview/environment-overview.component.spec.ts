import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentOverviewComponent } from './environment-overview.component';

describe('EnvironmentOverviewComponent', () => {
  let component: EnvironmentOverviewComponent;
  let fixture: ComponentFixture<EnvironmentOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvironmentOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
