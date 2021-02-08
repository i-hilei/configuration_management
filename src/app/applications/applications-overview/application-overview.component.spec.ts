import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicationOverviewComponent } from './application-overview.component';

describe('ApplicationOverviewComponent', () => {
  let component: ApplicationOverviewComponent;
  let fixture: ComponentFixture<ApplicationOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
