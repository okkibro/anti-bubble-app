import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  constructor(private http: HttpClient) { }

  // Method to do a POST request to send an email to reset your password.
  public sendEmail(email: string): Observable<any> {
    return this.http.post<any>('https://localhost:3000/user/passwordrecovery', {
      email: email,
    });
  }

  // Method to do a GET request to load the restPage.
  public getResetPage(token: string): Observable<any> {
    return this.http.get<any>(`https://localhost:3000/user/reset/${token}`);
  }

  // Method to do a POST request to reset the password of user to the new password.
  public postNewPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post<any>(`https://localhost:3000/user/reset/${token}`, {
      password: password,
      confirmPassword: confirmPassword,
    });
  }
}
