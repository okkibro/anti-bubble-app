/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * register.component.ts
 * This file handles all the logic for registering a new user in the app. Most of the validation of the
 * form inputs is done here in the front-end and passed to the back-end where some sanitization of
 * inputs is done and hashing of the password.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { ShopService } from 'src/app/services/shop.service';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'mean-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css',
		'../../shared/general-styles.css']
})

export class RegisterComponent implements OnInit {
	registerForm = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', {
				validators: [Validators.required, Validators.email],
				asyncValidators: [this.userService.uniqueEmailValidator()],
				updateOn: 'blur'
			}],
			role: ['', Validators.required],
			password: ['', Validators.required],
			repeatPassword: ['', Validators.required],
			classCode: ['']
		},
		{
			validator: this.passwordMatchValidator
		});

	/**
	 * RegisterComponent constructor.
	 * @param auth
	 * @param router
	 * @param fb
	 * @param shopService
	 * @param titleService
	 * @param userService
	 */
	constructor(
		private auth: AuthenticationService,
		private router: Router,
		private fb: FormBuilder,
		private shopService: ShopService,
		private titleService: Title,
		private userService: UserService
	) { }

	/**
	 * Initialization method.
	 * @returns
	 */
	ngOnInit(): void {
		this.titleService.setTitle('Registreer' + environment.TITLE_TRAIL);
	}

	/**
	 * Method to register a new user based on the information filled in on the form.
	 * @returns
	 */
	registerUser(): void {
		let user = new User();
		user.firstName = this.registerForm.get('firstName').value;
		user.lastName = this.registerForm.get('lastName').value;
		user.email = this.registerForm.get('email').value;
		user.role = this.registerForm.get('role').value;
		user.password = this.registerForm.get('password').value;

		this.auth.register(user).subscribe(() => {
			this.shopService.getBaseInventory().subscribe(data => {
				for (let i = 0; i < data.length; i++) {
					this.shopService.buy(data[i]).subscribe();
				}
				this.router.navigate(['login']);
			});
		});
	}

	/** Method to check if the filled in passwords match.
	 * @param form Form in which the validation has to take place.
	 * @returns
	 */
	passwordMatchValidator(form: FormGroup): void {
		let password = form.get('password').value;
		let repeatPassword = form.get('repeatPassword').value;
		if (password != repeatPassword) {
			form.get('repeatPassword').setErrors({ noPasswordMatch: true });
		}
	}
}