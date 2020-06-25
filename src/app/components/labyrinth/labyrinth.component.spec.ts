/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabyrinthComponent } from './labyrinth.component';

describe('LabyrinthComponent', () => {
  let component: LabyrinthComponent;
  let fixture: ComponentFixture<LabyrinthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabyrinthComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabyrinthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */