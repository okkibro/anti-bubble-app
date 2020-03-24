
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) { }
  email: string;
  password: string;
  ngOnInit() {
  }
  login(): void {
    if (this.email && this.password) {
      this.userService.getUser(this.email, this.password); //hashen?!
    } else {
      alert("Invalid credentials");
    }
  }
}
