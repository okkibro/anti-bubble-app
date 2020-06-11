import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PasswordRecoveryService {

  constructor(private http: HttpClient) { }

  public sendEmail(email: string): Observable<any> {
    return this.http.post<any>('https://localhost:3000/user/passwordrecovery', {
     email:email
    });
  }

  public getResetPage(token: string) : Observable<any> {
    return this.http.get<any>(`https://localhost:3000/user/reset/${token}`)
  }

  public postNewPassword(token: string, password: string, confirmPassword: string) : Observable<any> {
    return this.http.post<any>(`https://localhost:3000/user/reset/${token}`, {
      password: password,
      confirmPassword: confirmPassword
    })
  }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */