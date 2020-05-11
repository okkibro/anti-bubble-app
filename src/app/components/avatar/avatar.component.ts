import { Component, OnInit, ContentChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { MatTab } from '@angular/material/tabs';
import { ShopService } from 'src/app/services/shop.service';

@Component({
    selector: 'mean-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.css',
        '../../shared/general-styles.css']
})
export class AvatarComponent implements OnInit {

    userDetails: User;
    itemsShown = [];

    constructor(private auth: AuthenticationService, private shopService: ShopService) { }

    logoutButton() {
        return this.auth.logout();
    }

    ngOnInit() {
        // //display skin colors on init
        // var collection = document.getElementById("itemCollection");
        // var sc_Images: string[] = ["../../../assets/images/avatarpage/brown.jpg",
        // "../../../assets/images/avatarpage/beige.png",
        // "../../../assets/images/avatarpage/darkbrown.jpg"];

        // collection.appendChild(this.applyTabData(sc_Images)); 

        this.shopService.shop("alles").subscribe(shop => {
            this.auth.profile().subscribe(user => {
                for (let i = 0; i < shop.length; i++) {
                    if (user.inventory.find(x => x._id == shop[i]._id) != null) {
                        this.itemsShown.push(shop[i]);
                    }
                }
            })
        })
    }

    tabChange(event) {
        var currentTab = event.tab.textLabel;
        var collection = document.getElementById("itemCollection");

        //replace existing images with the images corresponding to the clicked tab
        // if (currentTab == "Huidskleur") {
        //     var sc_Images: string[] = ["../../../assets/images/avatarpage/brown.jpg",
        //     "../../../assets/images/avatarpage/beige.png",
        //     "../../../assets/images/avatarpage/darkbrown.jpg"];

        //     collection.lastChild.replaceWith(this.applyTabData(sc_Images));
        // }
        // else if (currentTab == "Kleding") {
        //     var cl_Images: string[] = ["../../../assets/images/avatarpage/pants.png",
        //     "../../../assets/images/avatarpage/shirt.png",
        //     "../../../assets/images/avatarpage/dress.png"];

        //     collection.lastChild.replaceWith(this.applyTabData(cl_Images));
        // }
        // else {
        //     var hat_Images: string[] = ["../../../assets/images/avatarpage/redHat1.png",
        //     "../../../assets/images/avatarpage/blueHat2.png",
        //     "../../../assets/images/avatarpage/blueHat4.png",
        //     "../../../assets/images/avatarpage/blueHat5.png",
        //     "../../../assets/images/avatarpage/greenHat2.png",
        //     "../../../assets/images/avatarpage/greenHat3.png"];

        //     collection.lastChild.replaceWith(this.applyTabData(hat_Images));
        //}
    }

    applyTabData(images: string[]) {

        var selectedTab = document.getElementById("itemCollection");
        var tabData = document.createElement("mat-tab");
        var newline = document.createElement("br");

        for (var i = 0; i < images.length; i++) {
            var image = document.createElement("img");
            image.setAttribute("src", images[i]);
            image.style.height = "40%";                      //height of artists' images is a lot higher
            image.style.width = "20%";
            image.style.padding = "0.5%";
            tabData.appendChild(image);

            if ((i % 3) == 0 && i > 0) {                   //breakline after 4 items (start at 0)
                tabData.appendChild(newline);
            }
        }

        selectedTab.appendChild(tabData);
        return tabData;
    }



}