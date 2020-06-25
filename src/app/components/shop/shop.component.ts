/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Shop } from '../../models/shop';
import { ShopService } from 'src/app/services/shop.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user';
import { MilestoneUpdatesService } from '../../services/milestone-updates.service'
import { milestones } from '../../../../constants';

@Component({
    selector: 'mean-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css',
        '../../shared/general-styles.css']
})

export class ShopComponent implements OnInit {
    userDetails: User;
    shopDetails: Shop[];
    filteredShop: Shop[];
    succesWindow: boolean = false;

    constructor(
        private auth: AuthenticationService,
        private shopService: ShopService,
        private snackBar: MatSnackBar,
        private milestoneUpdates: MilestoneUpdatesService
    ) { }

    ngOnInit(): void {
        this.shopService.shop('hoofddeksel').subscribe(shop => {
            this.shopDetails = shop;
            this.auth.profile().subscribe(user => {
                this.userDetails = user;
                this.filteredShop = this.filterShop();
                this.succesWindow = true;
            }, (err) => {
                console.error(err);
            });
        }, (err) => {
            console.error(err);
        });
    }

    /** Method to change categoty of items you are looking at in the shop */
    tabChange(value) {
        this.shopService.shop(value).subscribe(shop => {
            this.shopDetails = shop;
            this.filteredShop = this.filterShop();
        }, (err) => {
            console.error(err);
        });
    }

    /** Method to buy and item from the shop and add it to the users inventory and update the milestone if needed */
    buy(item): void {
        this.shopService.buy(item).subscribe((data:any) => {
            if (data.succes && this.succesWindow) {
                this.snackBar.open(data.message, 'X', { duration: 1000, panelClass: ['style-succes'], }).afterDismissed().subscribe(() => {
                    this.milestoneUpdates.updateMilestone(milestones[2], 1).subscribe(data => {
                        if (data.completed) {
                            this.milestoneUpdates.updateRecent(`${new Date().toLocaleDateString()}: Je hebt de badge 'Gierige Gerrie' verdiend!`).subscribe();
                        }
                        this.milestoneUpdates.updateMilestone(milestones[4], 1).subscribe(data => {
                            if (data.completed) {
                                this.milestoneUpdates.updateRecent(`${new Date().toLocaleDateString()}: Je hebt de badge 'Shoppaholic' verdiend`). subscribe();
                            }
                            window.location.reload();
                        });
                    });
                });
            } else if (this.succesWindow) {
                this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'], });
            }
        });
    }

    /** Method to filter the shop based on if the user already owns the item */
    filterShop(): Shop[] {
        return this.shopDetails.filter(x => {
            return this.userDetails.inventory.find(y => y._id == x._id) == null;
        });
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
