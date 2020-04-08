import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { invalidUser, validUser, blankUser } from 'src/mocks';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
const loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
const mockSnackbar = jasmine.createSpyObj('Snackbar', ['open']);

describe('LoginComponent', () => {
  let component: LoginComponent;

  beforeEach(async(() => {
    component = new LoginComponent(loginServiceSpy, routerSpy, new FormBuilder(), mockSnackbar);
  }));

  function updateForm(userEmail, userPassword) {
    component.loginForm.controls['username'].setValue(userEmail);
    component.loginForm.controls['password'].setValue(userPassword);
  }
  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('component initial state', () => {
    expect(component.submitted).toBeFalsy();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.invalid).toBeTruthy();
    expect(component.authError).toBeFalsy();
    expect(component.authErrorMsg).toBeUndefined();
  });

  it('submitted should be true when valid loginUser()', () => {
    component.loginUser(validUser);
    expect(component.submitted).toBeTruthy();
    expect(component.authError).toBeFalsy();
    expect(component.authErrorMsg).toBeUndefined();
  });

  it('submitted should be true when invalid loginUser()', () => {
    component.loginUser(invalidUser);
    expect(component.submitted).toBeTruthy();
    expect(component.authError).toBeTruthy();
    expect(component.authErrorMsg).toBeDefined();
  });

});
