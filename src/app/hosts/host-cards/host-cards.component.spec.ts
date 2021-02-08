import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostCardsComponent } from './host-cards.component';

describe('HostCardsComponent', () => {
  let component: HostCardsComponent;
  let fixture: ComponentFixture<HostCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
