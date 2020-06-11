import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'mean-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css',
              '../../shared/general-styles.css']
})
export class NavBarComponent implements OnInit {
  userDetails: User;

  constructor(private auth: AuthenticationService,) { }

  ngOnInit(): void {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;
    })
  }

  /** Method to logout. */ 
  logoutButton() {
    return this.auth.logout();
  }

}
