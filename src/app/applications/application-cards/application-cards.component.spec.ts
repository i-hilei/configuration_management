import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicationCardsComponent } from './application-cards.component';
import {MatButtonModule, MatCardModule, MatIconModule} from "@angular/material";

describe('ApplicationCardsComponent', () => {
  let component: ApplicationCardsComponent;
  let fixture: ComponentFixture<ApplicationCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports:[MatCardModule,MatIconModule,MatButtonModule],
      declarations: [ ApplicationCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
