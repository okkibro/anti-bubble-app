/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Components
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { titleTrail } from '../../../../constants';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';

/**
 * This class handles all the logic for registering a new user in the app. Most of the validation of the
 * form inputs is done here in the front-end and passed to the back-end where some sanitization of
 * inputs is done and hashing of the password.
 */
@Component({
	selector: 'register-component',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css',
		'../../shared/general-styles.css']
})

export class RegisterComponent implements OnInit {
	public registerForm = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			gender: ['', Validators.required],
			email: ['', {
				validators: [Validators.required, Validators.email],
				asyncValidators: [this.userService.uniqueEmailValidator()],
				updateOn: 'blur'
			}],
			role: ['', Validators.required],
			password: ['', Validators.required],
			repeatPassword: ['', Validators.required],
		},
		{
			validator: RegisterComponent.passwordMatchValidator
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
	 * @return
	 */
	public ngOnInit(): void {
		// Set page title.
		this.titleService.setTitle('Registreer' + titleTrail);
	}

	/**
	 * Method to register a new user based on the information filled in on the form.
	 * @return
	 */
	public registerUser(): void {
		let user = new User();
		user.firstName = this.registerForm.get('firstName').value;
		user.lastName = this.registerForm.get('lastName').value;
		user.gender = this.registerForm.get('gender').value;
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
	 * @return
	 */
	private static passwordMatchValidator(form: FormGroup): void {
		let password = form.get('password').value;
		let repeatPassword = form.get('repeatPassword').value;
		if (password != repeatPassword) {
			form.get('repeatPassword').setErrors({ noPasswordMatch: true });
		}
	}
}