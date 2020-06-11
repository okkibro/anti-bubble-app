import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, FormsModule  } from '@angular/forms';

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
      declarations: [ PasswordResetComponent, ActivatedRoute ],
      providers: [
        {
          provide: PasswordRecoveryService,
          useValue: passwordRecoveryServiceStub
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
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
