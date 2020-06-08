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
        this.shopService.shop("lichaam").subscribe(shop => {
            this.auth.profile().subscribe(user => {
                this.userDetails = user;
                for (let i = 0; i < shop.length; i++) {
                    if (user.inventory.find(x => x._id == shop[i]._id) != null) {
                        this.itemsShown.push(shop[i]);
                        this.filteredAvatar = this.filterAvatar();
                    }
                }
                user.avatar
            })
        })
    }

    equip(item){
        this.avatarService.equip(item).subscribe(data => {
            console.log(data);
            document.getElementById(data.category).setAttribute("src", data.image);
        });
    }

    tabChange(event) {
        var currentTab = event.tab.textLabel;
        this.shopService.shop(currentTab).subscribe(shop => {
            this.itemsShown = shop;
            this.filteredAvatar = this.filterAvatar();
        }, (err) => {
            console.error(err);
        });
    }

    filterAvatar(): AvatarComponent[] {
        return this.itemsShown.filter(x => {
          return this.userDetails.inventory.find(y => x._id == y._id) != null
        });  
    }
}