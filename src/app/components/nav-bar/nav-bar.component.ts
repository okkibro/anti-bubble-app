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

  constructor(private authenticationService: AuthenticationService,) { }

  ngOnInit(): void {
    this.authenticationService.profile().subscribe(user => {
      this.userDetails = user;
  })
  }

  logoutButton() {
    return this.authenticationService.logout();
}

}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
