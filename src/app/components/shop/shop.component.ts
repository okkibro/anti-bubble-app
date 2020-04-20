import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import {Router} from '@angular/router';
import { User } from '../../models/user';

@Component({
    selector: 'mean-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css',
                '../../shared/general-styles.css']
})

export class ShopComponent implements OnInit {

  userDetails: User;

  constructor(private authenticationService: AuthenticationService) { }

  logoutButton() {
    return this.authenticationService.logout();
  }

  ngOnInit(): void {
  }

}