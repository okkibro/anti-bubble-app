/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../../services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { of } from 'rxjs';


import { RegisterComponent } from './register.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const authRegisterStub: jasmine.SpyObj<AuthenticationService> = jasmine.createSpyObj(
    'authService',
    ['register', 'uniqueEmailValidator']
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [HttpClientModule, HttpClientTestingModule, RouterModule.forRoot([]), ReactiveFormsModule, FormsModule],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authRegisterStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('should render form with firstname, lastname, email, pw1, pw2 and radio control inputs', () => {
    const element = fixture.nativeElement;

    expect(element.querySelector('.example-form')).toBeTruthy();
    expect(element.querySelectorAll('input')[0]).toBeTruthy();
    expect(element.querySelectorAll('input')[1]).toBeTruthy();
    expect(element.querySelectorAll('input')[2]).toBeTruthy();
    expect(element.querySelectorAll('input')[3]).toBeTruthy();
    expect(element.querySelectorAll('input')[4]).toBeTruthy();
    expect(element.querySelectorAll('mat-radio-button')[0]).toBeTruthy();
    expect(element.querySelectorAll('mat-radio-button')[1]).toBeTruthy();
    expect(element.querySelector('button')).toBeTruthy();
  });

  it('should return model invalid when form is empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate firstname input as required', () => {
    const firstname = component.registerForm.controls.firstName;

    expect(firstname.valid).toBeFalsy();
    expect(firstname.errors.required).toBeTruthy();
  });

  it('should validate lastname input as required', () => {
    const lastname = component.registerForm.controls.lastName;

    expect(lastname.valid).toBeFalsy();
    expect(lastname.errors.required).toBeTruthy();
  });

  it('should validate email input as required', () => {
    const email = component.registerForm.controls.email;

    expect(email.valid).toBeFalsy();
    expect(email.errors.required).toBeTruthy();
  });

  it('should validate pw1 input as required', () => {
    const pw1 = component.registerForm.controls.password;

    expect(pw1.valid).toBeFalsy();
    expect(pw1.errors.required).toBeTruthy();
  });

  it('should validate pw1 input as required', () => {
    const pw2 = component.registerForm.controls.repeatPassword;

    expect(pw2.valid).toBeFalsy();
    expect(pw2.errors.required).toBeTruthy();
  });

  it('should validate pw1 input as required', () => {
    const radio = component.registerForm.controls.role;

    expect(radio.valid).toBeFalsy();
    expect(radio.errors.required).toBeTruthy();
  });

  it('should validate email format', () => {
    const email = component.registerForm.controls.email;
    email.setValue('test');
    const errors = email.errors;

    expect(errors.required).toBeFalsy();
    expect(errors.email).toBeTruthy();
    expect(email.valid).toBeFalsy();
  });

  it('should validate pw1 and pw2', () => {
    const pw1 = component.registerForm.controls.password;
    pw1.setValue('test');
    const pw2 = component.registerForm.controls.repeatPassword;
    pw2.setValue('tester');

    fixture.detectChanges();

    const pw1errors = pw1.errors || {};
    const pw2errors = pw2.errors || {};

    expect(pw1errors.required).toBeFalsy();
    expect(pw2errors.required).toBeFalsy();
    expect(pw2errors.noPasswordMatch).toBeTruthy();
  });

  it('should invoke auth service when form is valid', () => {
    const firstName = component.registerForm.controls.firstName;
    firstName.setValue('test');
    const lastName = component.registerForm.controls.lastName;
    lastName.setValue('de Tester');
    const email = component.registerForm.controls.email;
    email.setValue('test@test.com');
    const role = component.registerForm.controls.role;
    role.setValue('student');
    const password = component.registerForm.controls.password;
    password.setValue('123456');
    const repeatPassword = component.registerForm.controls.repeatPassword;
    repeatPassword.setValue('123456');

    authRegisterStub.register.and.returnValue(of());

    fixture.detectChanges();

    let user = new User();
    user.firstName = firstName.value;
    user.lastName = lastName.value;
    user.email = email.value;
    user.role = role.value;
    user.password = password.value;


    fixture.nativeElement.querySelector('button').click();

    expect(authRegisterStub.register.calls.any()).toBeTruthy();
    expect(authRegisterStub.register).toHaveBeenCalledWith(user);
  });
});

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */