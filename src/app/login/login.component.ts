
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) { }
  email: string;
  password: string;
  ngOnInit() {
  }
  login(): void {
    if (this.email == 'admin' && this.password == 'admin') {
      this.router.navigate(["user"]);
    } else {
      alert("Invalid credentials");
    }
  }
}
