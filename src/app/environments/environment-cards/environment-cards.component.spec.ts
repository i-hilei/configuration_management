import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EnvironmentCardsComponent } from './environment-cards.component';

describe('EnvironmentCardsComponent', () => {
  let component: EnvironmentCardsComponent;
  let fixture: ComponentFixture<EnvironmentCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
