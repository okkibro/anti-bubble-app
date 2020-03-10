import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mean-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router) { }
  email: string;
  name: string;
  ngOnInit() {
  }
  register(): void {
    if (this.email && this.name) {
      alert("Users Registerd") //filler code
    } else {
      alert("Fill in both fields")
    }
  }
}
