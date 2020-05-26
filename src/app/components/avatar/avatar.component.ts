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
                this.showAvatar();
            })
        })
    }

    equip(item){
        this.avatarService.equip(item).subscribe(data => {
            console.log(data);
            document.getElementById(data.category).setAttribute("src", data.image);
        });
    }

    showAvatar(){
        document.getElementById("haar1").setAttribute("src", this.userDetails.avatar.haar1?.fullImage);
        document.getElementById("lichaam").setAttribute("src", this.userDetails.avatar.lichaam.fullImage);
        document.getElementById("broek").setAttribute("src", this.userDetails.avatar.broek?.fullImage);
        document.getElementById("shirt").setAttribute("src", this.userDetails.avatar.shirt?.fullImage);
        document.getElementById("schoenen").setAttribute("src", this.userDetails.avatar.schoenen?.fullImage);
        document.getElementById("bril").setAttribute("src", this.userDetails.avatar.bril?.fullImage);
        document.getElementById("haar2").setAttribute("src", this.userDetails.avatar.haar2?.fullImage);
        document.getElementById("hoofddeksel").setAttribute("src", this.userDetails.avatar.hoofddeksel?.fullImage);
        document.getElementById("medaille").setAttribute("src", this.userDetails.avatar.medaille?.fullImage);   
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