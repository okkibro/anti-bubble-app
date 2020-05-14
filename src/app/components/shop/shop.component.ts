import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Shop } from '../../models/shop';
import { ShopService } from 'src/app/services/shop.service';
import { BuiltinType, CompileTemplateMetadata } from '@angular/compiler';
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

  constructor(private authenticationService: AuthenticationService, private shopService : ShopService, private snackBar: MatSnackBar, private milestoneUpdates: MilestoneUpdatesService) { }

  logoutButton() {
    return this.authenticationService.logout();
  }

  ngOnInit(): void {
    this.shopService.shop("alles").subscribe(shop => {
      this.shopDetails = shop;
      this.authenticationService.profile().subscribe(user => {
        this.userDetails = user;
        this.filteredShop = this.filterShop();
      }, (err) => {
        console.error(err);
      });
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
        this.snackBar.open(data.message, 'X', {duration: 1000, panelClass: ['style-succes'], }).afterDismissed().subscribe(() => {
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
        });;
      } else {
        this.snackBar.open(data.message, 'X', {duration: 2500, panelClass: ['style-error'], });
      }
    });
  }

  filterShop(): Shop[] {
      return this.shopDetails.filter(x => {
        return this.userDetails.inventory.find(y => y._id == x._id) == null;
      });  
  }
}