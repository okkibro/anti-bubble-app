/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const authServiceStub: jasmine.SpyObj<AuthenticationService> = jasmine.createSpyObj(
    'authService',
    ['login']
  );
  const snackbarStub: jasmine.SpyObj<MatSnackBar> = jasmine.createSpyObj(
    'snackBar',
    ['open']
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientModule, HttpClientTestingModule, RouterModule.forRoot([]), ReactiveFormsModule, MatSnackBarModule],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authServiceStub
        },
        {
          provide: MatSnackBar,
          useValue: snackbarStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('should render form with email and password inputs', () => {
    const element = fixture.nativeElement;

    expect(element.querySelector('.example-form')).toBeTruthy();
    expect(element.querySelectorAll('input')[0]).toBeTruthy();
    expect(element.querySelectorAll('input')[1]).toBeTruthy();
    expect(element.querySelector('button')).toBeTruthy();
  });

  it('should return model invalid when form is empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email input as required', () => {
    const email = component.loginForm.controls.email;

    expect(email.valid).toBeFalsy();
    expect(email.errors.required).toBeTruthy();
  });

  it('should validate password input as required', () => {
    const password = component.loginForm.controls.password;

    expect(password.valid).toBeFalsy();
    expect(password.errors.required).toBeTruthy();
  });

  it('should validate email format', () => {
    const email = component.loginForm.controls.email;
    email.setValue('test');
    const errors = email.errors;

    expect(errors.required).toBeFalsy();
    expect(errors.email).toBeTruthy();
    expect(email.valid).toBeFalsy();
  });

  it('should validate email format correctly', () => {
    const email = component.loginForm.controls.email;
    email.setValue('test@test.com');
    const errors = email.errors || {};

    expect(email.valid).toBeTruthy();
    expect(errors.email).toBeFalsy();
    expect(errors.pattern).toBeFalsy();
  });

  it('should invoke auth service when form is valid', () => {
    const email = component.loginForm.controls.email;
    email.setValue('test@test.com');
    const password = component.loginForm.controls.password;
    password.setValue('123456');
    authServiceStub.login.and.returnValue(of());

    fixture.detectChanges();

    let user = new User();
    user.email = email.value;
    user.password = password.value;

    fixture.nativeElement.querySelector('button').click();

    expect(authServiceStub.login.calls.any()).toBeTruthy();
    expect(authServiceStub.login).toHaveBeenCalledWith(user);
  });
});

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */