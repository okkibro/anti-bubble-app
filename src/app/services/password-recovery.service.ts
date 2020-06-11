import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PasswordRecoveryService {

  constructor(private http: HttpClient) { }

  /** Function that sends an HTTP post request to the back-end which will send an email to the given email address. */
  public sendEmail(email: string): Observable<any> {
    return this.http.post<any>('https://localhost:3000/user/passwordrecovery', {
     email:email
    });
  }

  /** Function that sends an HTTP get request which will get the password reset page based on the correctness of the given token. */
  public getResetPage(token: string) : Observable<any> {
    return this.http.get<any>(`https://localhost:3000/user/reset/${token}`);
  }

  /** Function that sends an HTTP post request which will change the user's password to the given password in the body. */
  public postNewPassword(token: string, password: string, confirmPassword: string) : Observable<any> {
    return this.http.post<any>(`https://localhost:3000/user/reset/${token}`, {
      password: password,
      confirmPassword: confirmPassword
    });
  }
}
