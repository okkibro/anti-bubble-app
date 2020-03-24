import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
    this.authService.register(this.signupForm.value).subscribe((res) => {
      if (res.result) {
        this.signupForm.reset();
        this.router.navigate(['login']);
      }
    })
  }
}
