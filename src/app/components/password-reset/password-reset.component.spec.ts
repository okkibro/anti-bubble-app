/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { ActivatedRoute } from '@angular/router';

import { PasswordResetComponent } from './password-reset.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  const passwordRecoveryServiceStub: jasmine.SpyObj<PasswordRecoveryService> = jasmine.createSpyObj(
    'passwService',
    ['postNewPassword']
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordResetComponent, ActivatedRoute],
      providers: [
        {
          provide: PasswordRecoveryService,
          useValue: passwordRecoveryServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });
});

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */