import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    email: string;
    password: string;

    constructor(private router: Router, private userService: UserService) { }

    ngOnInit() { }

    login(): void {
        if (this.email && this.password) {
            this.userService.getUser(this.email, this.password); //hashen?!
        } else {
            alert("Invalid credentials");
        }
    }
}
