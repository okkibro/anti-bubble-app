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

  shopDetails: Shop[] ;

  constructor(private authenticationService: AuthenticationService, private shopService : ShopService) { }

  logoutButton() {
    return this.authenticationService.logout();
  }

  ngOnInit(): void {
    this.shopService.shop().subscribe(shop => {
      this.shopDetails = shop;
      console.log(this.shopDetails.length);
      console.log(this.shopDetails[0].title);
      this.loadTable();
  }, (err) => {
      console.error(err);
  });
   //this.shopService.createShop().subscribe();
  }
  
 // Building the table for all elements in the shop
  loadTable(){
    for(var i = 0; i < this.shopDetails.length; i++){

      //Puting the elements from the database in variables
      var title = this.shopDetails[i].title;
      var image = this.shopDetails[i].image;
      var price = this.shopDetails[i].price;

      //Making HTML elements
      var anchor = document.getElementById("shopAnchor");
      var card1 = document.createElement("mat-card");
      var image1 = document.createElement("img");
      var tableRow1 = document.createElement("tr");
      var tableRow2 = document.createElement("tr");
      var tableRow3 = document.createElement("tr");

      image1.setAttribute("src", image);

      var price1 = document.createElement("button");
      var price1Text = document.createTextNode(price.toString());
      price1.appendChild(price1Text);
      var title1 = document.createTextNode(title);
   
      //Building actual table 
      tableRow1.appendChild(image1);
      tableRow2.appendChild(title1);
      tableRow3.appendChild(price1);
      card1.appendChild(tableRow1);
      card1.appendChild(tableRow2);
      card1.appendChild(tableRow3);
      anchor.appendChild(card1);
    }
  }
}