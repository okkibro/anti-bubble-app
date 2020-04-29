import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpXsrfTokenExtractor } from '@angular/common/http';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

@Component({
  selector: 'mean-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css',
              '../../shared/general-styles.css']
})
export class PasswordRecoveryComponent implements OnInit {
  passwordRecoveryForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private passwordRecoveryService: PasswordRecoveryService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar, private http: HttpClient) { }

  ngOnInit() { }

  sendEmail() {
    console.log("sending email...");
    let email = this.passwordRecoveryForm.get('email').value;
    this.http.post<any>('https://localhost:3000/user/passwordrecovery', {
     email:email
    }).subscribe(data => {
      if (!data.succes){
        this.snackBar.open(data.message, 'X' , { duration: 2500, panelClass: ['style-error'] });
      } else {
        this.snackBar.open(data.message, 'X' , { duration: 2500, panelClass: ['style-succes']})
      }
    });
  }
}