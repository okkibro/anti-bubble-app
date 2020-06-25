/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { ShopService } from 'src/app/services/shop.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { AvatarDisplayComponent } from '../avatar-display/avatar-display.component';

@Component({
    selector: 'mean-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.css',
        '../../shared/general-styles.css'],
    providers: [AvatarDisplayComponent]
})
export class AvatarComponent implements OnInit {
    userDetails: User;
    itemsShown = [];
    filteredAvatar = [];

    constructor(
        private auth: AuthenticationService,
        private shopService: ShopService,
        private avatarService: AvatarService,
        private avatarDisplay: AvatarDisplayComponent
    ) { }

    ngOnInit() {
        this.shopService.shop('hoofddeksel').subscribe(shop => {
            this.auth.profile().subscribe(user => {
                this.userDetails = user;

                // Checks for items in the shop that the player bought
                for (let i = 0; i < shop.length; i++) {
                    if (user.inventory.find(x => x._id == shop[i]._id) != null) {
                        this.itemsShown.push(shop[i]);
                        this.filteredAvatar = this.filterAvatar();
                    }
                }
                this.avatarDisplay.showAvatar();
            })
        })
    }

    /** Method that assigns an item to the user's avatar in the database. */
    equip(item) {
        this.avatarService.equip(item).subscribe(data => {

            // Updates the image shown to the player without reloading the page.
            if (data.category == 'haar') {
                document.getElementById('haar1').setAttribute('src', data.imageFull2);
                document.getElementById('haar2').setAttribute('src', data.imageFull);
            }
            else{
                document.getElementById(data.category).setAttribute('src', data.imageFull);
            }
        });
    }

    /** Method to change the tab in the HTML and updates the shown items. */
    tabChange(value) {
        this.shopService.shop(value).subscribe(shop => {
            this.itemsShown = shop;
            this.filteredAvatar = this.filterAvatar();
        }, (err) => {
            console.error(err);
        });
    }

    /** Method to filter the avatar items to only show the items in the inventory/that the player bought. */
    filterAvatar(): AvatarComponent[] {
        return this.itemsShown.filter(x => {
            return this.userDetails.inventory.find(y => x._id == y._id) != null
        });
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */