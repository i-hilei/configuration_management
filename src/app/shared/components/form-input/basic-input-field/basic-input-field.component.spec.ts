import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

describe('LoginComponent', () => {
  let component: BasicInputField;
  let fixture: ComponentFixture<BasicInputField>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BasicInputField]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInputField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render fields for old-, new- and confirm-password', () => {
  });
});
