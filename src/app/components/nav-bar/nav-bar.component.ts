import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'mean-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css',
              '../../shared/general-styles.css']
})
export class NavBarComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,) { }

  ngOnInit(): void {
  }

  logoutButton() {
    return this.authenticationService.logout();
}

}
