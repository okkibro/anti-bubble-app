/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

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
