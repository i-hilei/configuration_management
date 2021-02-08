import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineCardsComponent } from './pipeline-cards.component';

describe('PipelineCardsComponent', () => {
  let component: PipelineCardsComponent;
  let fixture: ComponentFixture<PipelineCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelineCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
