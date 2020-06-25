/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionOptionsComponent } from './session-options.component';

describe('SessionOptionsComponent', () => {
  let component: SessionOptionsComponent;
  let fixture: ComponentFixture<SessionOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SessionOptionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
