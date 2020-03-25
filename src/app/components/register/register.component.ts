import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
    selector: 'mean-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
    firstName: string;
    lastName: string;
    email: string;
    password: string;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() { }

    registerUser() {
        let user = new User();
        user.email = this.email;
        user.password = this.password;
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        this.authService.register(user).subscribe((res) => {
            this.router.navigate(['login']);
        })
    }
}
