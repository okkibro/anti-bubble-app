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
    email: string;
    password: string;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() { }

    registerUser() {
        let user = new User();
        user.email = this.email;
        user.password = this.password;
        user._id = 1234;
        user.name = 'tijmen';
        this.authService.register(user).subscribe((res) => {
            if (res.result) {
                this.router.navigate(['login']);
            }
        })
    }
}
