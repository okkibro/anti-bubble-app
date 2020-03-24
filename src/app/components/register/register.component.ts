import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'mean-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  password: String;
  email: String;

  constructor(private authService: AuthService, private router: Router) {
    
  }

  ngOnInit() { }

  registerUser() {
    console.log("test");
    var user = new User();
    user.email = this.email;
    user.password = this.password;
    user._id = '1234';
    user.name = 'tijmen';
    this.authService.register(user).subscribe((res) => {
      if (res.result) {
        this.signupForm.reset();
        this.router.navigate(['login']);
      }
    })
  }
}
