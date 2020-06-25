/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinClassComponent } from './join-class.component';

describe('JoinClassComponent', () => {
  let component: JoinClassComponent;
  let fixture: ComponentFixture<JoinClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JoinClassComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */