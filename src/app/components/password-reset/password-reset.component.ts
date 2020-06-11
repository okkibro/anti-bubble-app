import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

@Component({
  selector: 'mean-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css',
    '../../shared/general-styles.css']
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm = this.fb.group({
    password: ['', [Validators.required]],
    confirmPassword: ['', Validators.required],
  });

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar, private passwordRecoveryService: PasswordRecoveryService) { }

  ngOnInit(): void {
    this.passwordRecoveryService.getResetPage(this.route.snapshot.paramMap.get("token")).subscribe((data) => {
      if (data.correct) {
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  resetPassword() {
    let password = this.passwordResetForm.get('password').value;
    let confirmPassword = this.passwordResetForm.get('confirmPassword').value;
    this.passwordRecoveryService.postNewPassword(this.route.snapshot.paramMap.get("token"), password, confirmPassword).subscribe(data => {
      if (!data.succes) {
        this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'], });
      } else {
        this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'], }).afterDismissed().subscribe(() => {
          this.router.navigate(['/login']);
        });

      }
    });
  }

}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
