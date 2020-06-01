import { Component, OnInit, ContentChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { MatTab } from '@angular/material/tabs';
import { ShopService } from 'src/app/services/shop.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { arrayMax } from 'highcharts';

@Component({
    selector: 'mean-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.css',
        '../../shared/general-styles.css']
})
export class AvatarComponent implements OnInit {

    userDetails: User;
    itemsShown = [];
    filteredAvatar = [];

    constructor(private auth: AuthenticationService, private shopService: ShopService, private avatarService: AvatarService) { }

    logoutButton() {
        return this.auth.logout();
    }

    ngOnInit() {
        this.shopService.shop("haar").subscribe(shop => {
            this.auth.profile().subscribe(user => {
                this.userDetails = user;
                // Checks for items in the shop that the player bought
                for (let i = 0; i < shop.length; i++) {
                    if (user.inventory.find(x => x._id == shop[i]._id) != null) {
                        this.itemsShown.push(shop[i]);
                        this.filteredAvatar = this.filterAvatar();
                    }
                }
                this.showAvatar();
            })
        })
    }

    // Assigns an item to the user's avatar in the database
    equip(item){
        this.avatarService.equip(item).subscribe(data => {
            console.log(data);
            // Updates the image shown to the player without reloading the page
            document.getElementById(data.category).setAttribute("src", data.image);
        });
    }

    // Function to show the avatar, taking the object from the database
    showAvatar(){
        document.getElementById("haar1").setAttribute("src", this.userDetails.avatar.haar1?.fullImage);
        document.getElementById("lichaam").setAttribute("src", this.userDetails.avatar.body?.fullImage);
        document.getElementById("broek").setAttribute("src", this.userDetails.avatar.pants?.fullImage);
        document.getElementById("shirt").setAttribute("src", this.userDetails.avatar.shirt?.fullImage);
        document.getElementById("schoenen").setAttribute("src", this.userDetails.avatar.schoenen?.fullImage);
        document.getElementById("bril").setAttribute("src", this.userDetails.avatar.bril?.fullImage);
        document.getElementById("haar2").setAttribute("src", this.userDetails.avatar.haar2?.fullImage);
        document.getElementById("hoofddeksel").setAttribute("src", this.userDetails.avatar.hoofddeksel?.fullImage);
        document.getElementById("medaille").setAttribute("src", this.userDetails.avatar.medaille?.fullImage);
        console.log( this.userDetails.avatar.body?.fullImage);   
    }

    // Changes the tab in the HTML and updates the shown items
    tabChange(value) {
        // var currentTab = event.tab.textLabel;
        // console.log(value);
        this.shopService.shop(value).subscribe(shop => {
            this.itemsShown = shop;
            this.filteredAvatar = this.filterAvatar();
        }, (err) => {
            console.error(err);
        });
    }

    // Filtering the avatar items to only show the items in the inventory/that the player bought
    filterAvatar(): AvatarComponent[] {
        return this.itemsShown.filter(x => {
          return this.userDetails.inventory.find(y => x._id == y._id) != null
        });  
    }
}