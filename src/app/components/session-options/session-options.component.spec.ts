import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionOptionsComponent } from './session-options.component';

describe('SessionOptionsComponent', () => {
  let component: SessionOptionsComponent;
  let fixture: ComponentFixture<SessionOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
