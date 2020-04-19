import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';

@Component({
  selector: 'mean-classmateProfile',
  templateUrl: './classmateProfile.component.html',
  styleUrls: ['./classmateProfile.component.css',
              '../../shared/general-styles.css']
})
export class ClassmateProfileComponent implements OnInit {

  userDetails: User;

  constructor(private auth: AuthenticationService) { }

  logoutButton() {
    return this.auth.logout();
  }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;
  }, (err) => {
      console.error(err);
  });
  }

}