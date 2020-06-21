import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLoggedInToolbarComponent } from './not-logged-in-toolbar.component';

describe('NotLoggedInToolbarComponent', () => {
  let component: NotLoggedInToolbarComponent;
  let fixture: ComponentFixture<NotLoggedInToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotLoggedInToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotLoggedInToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
