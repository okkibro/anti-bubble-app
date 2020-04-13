import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';

@Component({
  selector: 'mean-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css',
              '../../shared/general-styles.css']
})
export class AvatarComponent implements OnInit {

  userDetails: User;

  constructor(private authenticationService: AuthenticationService) { }

  logoutButton() {
    return this.authenticationService.logout();
  }

  ngOnInit(): void {
  }

}