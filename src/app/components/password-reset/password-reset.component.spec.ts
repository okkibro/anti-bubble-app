/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

import { PasswordResetComponent } from './password-reset.component';

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
		}).compileComponents();
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