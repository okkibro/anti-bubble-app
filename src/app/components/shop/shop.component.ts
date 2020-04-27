import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Shop } from '../../models/shop';
import { ShopService } from 'src/app/services/shop.service';

@Component({
    selector: 'mean-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css',
                '../../shared/general-styles.css']
})

export class ShopComponent implements OnInit {

  shopDetails: Shop;

  constructor(private authenticationService: AuthenticationService, private shopService : ShopService) { }

  logoutButton() {
    return this.authenticationService.logout();
  }

  ngOnInit(): void {
    this.shopService.shop().subscribe(shop => {
      this.shopDetails = shop;
      console.log(shop);
  }, (err) => {
      console.error(err);
  });
  this.shopService.createShop().subscribe();
  }
}