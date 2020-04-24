import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Shop } from '../../models/shop';

@Component({
    selector: 'mean-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css',
                '../../shared/general-styles.css']
})

export class ShopComponent implements OnInit {

  shopDetails: Shop;

  constructor(private authenticationService: AuthenticationService) { }

  logoutButton() {
    return this.authenticationService.logout();
  }

  ngOnInit(): void {
    this.authenticationService.shop().subscribe(shop => {
      this.shopDetails = shop;
      console.log(shop, this.shopDetails);
  }, (err) => {
      console.error(err);
  });
  }

  // addItem() {
  //   let shop = new Shop();

  //   shop.title = "Hoedje";
  //   shop.image = "/assets/images/mean_stack_banner.png";
  //   shop.price = "5";

  // }

  getShopItems() {
    //database returns id, image, price and name of the product
    var input = 
   "{\"id\":\"34835\",\"image\":\"/assets/images/mean_stack_banner.png\",\"price\":\"10\",\"name\":\"Zonnebril\"}";

    input = input.substring(1, input.length-1);
    var itemInfo = input.split(",");

    var items:string[] = [];

    //loop filters information for each section of the query result and returns an array
    for(var i = 0; i < itemInfo.length ; i++){
      var full = itemInfo[i].split(":");
      var partial = full[1];
      var final = partial.substring(1, partial.length-1);
      items[i] = final;
    }

    //building the table for the HTML
    var anchor = document.getElementById("shopAnchor");
    var card1 = document.createElement("mat-card");
    var cardContent1 = document.createElement("mat-card-content");
    var image1 = document.createElement("img");
    var cutLine = document.createElement("br");

    image1.setAttribute("src", items[1]);
    cardContent1.setAttribute("ng-class","style");
    cardContent1.setAttribute("ng-model", "style");
    cardContent1.setAttribute("id","id1");

    var price1 = document.createElement("button");
    var price1Text = document.createTextNode(items[2]);
    price1.appendChild(price1Text);
    var title1 = document.createTextNode(items[3]);
    
    cardContent1.appendChild(image1);
    cardContent1.appendChild(cutLine);
    cardContent1.appendChild(title1);
    cardContent1.appendChild(cutLine);
    cardContent1.appendChild(price1);
    card1.appendChild(cardContent1);
    anchor.appendChild(card1);
  }

}