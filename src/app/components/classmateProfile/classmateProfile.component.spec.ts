import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassmateProfileComponent } from './classmateProfile.component';

describe('ClassmateProfileComponent', () => {
  let component: ClassmateProfileComponent;
  let fixture: ComponentFixture<ClassmateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassmateProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassmateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
