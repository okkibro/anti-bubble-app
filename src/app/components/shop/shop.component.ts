import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Shop } from '../../models/shop';
import { ShopService } from 'src/app/services/shop.service';
import { BuiltinType } from '@angular/compiler';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'mean-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css',
                '../../shared/general-styles.css']
})

export class ShopComponent implements OnInit {

  shopDetails: Shop ;

  constructor(private authenticationService: AuthenticationService, private shopService : ShopService, private snackBar: MatSnackBar) { }

  logoutButton() {
    return this.authenticationService.logout();
  }

  ngOnInit(): void {
    this.shopService.shop("alles").subscribe(shop => {
      this.shopDetails = shop;
  }, (err) => {
      console.error(err);
  });
  }
  
  tabChange(event) {
    var currentTab = event.tab.textLabel;
    this.shopService.shop(currentTab).subscribe(shop => {
        this.shopDetails = shop;
    }, (err) => {
        console.error(err);
    });
  }

  buy(item): void {
    this.shopService.buy(item).subscribe((data:any) => {  
      if (data.succes) {
        this.snackBar.open(data.message, 'X', {duration: 2500, panelClass: ['style-succes'], });
      } else {
        this.snackBar.open(data.message, 'X', {duration: 2500, panelClass: ['style-error'], });
      }
    });
  }
}