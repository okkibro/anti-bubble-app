import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
    selector: 'mean-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    email: string;
    password: string;

    constructor(private authService: AuthService) { }

    ngOnInit() { }

    loginUser() {
        let user = new User();
        user.email = this.email;
        user.password = this.password;
        this.authService.login(user)
    }
}