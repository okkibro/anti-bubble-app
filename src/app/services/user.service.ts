import { Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private webService: WebService) { }

  getUser(email: string, hash: string) {
    return this.webService.get('user', {email, hash})
  }

  registerUser(email: string, name: string) {
    return this.webService.post('user', {email, name})
  }
}
