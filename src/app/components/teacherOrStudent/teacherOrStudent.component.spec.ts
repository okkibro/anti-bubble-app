import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherOrStudentComponent } from './teacherOrStudent.component';

describe('StudentOrTeacherComponent', () => {
  let component: TeacherOrStudentComponent;
  let fixture: ComponentFixture<TeacherOrStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherOrStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherOrStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */