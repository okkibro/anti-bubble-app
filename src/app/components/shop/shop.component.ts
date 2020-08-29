/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Components
 */
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { ShopService } from 'src/app/services/shop.service';
import { milestones, titleTrail } from '../../../../constants';
import { Item } from '../../models/item';
import { User } from '../../models/user';
import { MilestoneUpdatesService } from '../../services/milestone-updates.service';
import { UserService } from '../../services/user.service';

/**
 * This class handles all the logic for handling for creating the app's item shop. User can browse throught the store
 * and buy items they don't have yet. Each item category has its own tab and changing tabs and filtering items based on
 * the tab is all handled here.
 */
@Component({
	selector: 'shop-component',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.css',
		'../../shared/general-styles.css']
})

export class ShopComponent implements OnInit {
	public userDetails: User;
	private shopDetails: Item[];
	public filteredShop: Item[];
	public itemColumns: number;
	public shopCategories: string[] = [
		'Hoofddeksel',
		'Haar',
		'Bril',
		'Shirt',
		'Broek',
		'Schoenen',
		'Medaille'
	];

	/**
	 * ShopComponent constructor.
	 * @param shopService
	 * @param snackBar
	 * @param milestoneUpdates
	 * @param titleService
	 * @param userService
	 */
	constructor(
		private shopService: ShopService,
		private snackBar: MatSnackBar,
		private milestoneUpdates: MilestoneUpdatesService,
		private titleService: Title,
		private userService: UserService
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void {
		this.userService.profile().subscribe(user => {
			this.userDetails = user;
			this.shopService.getCategoryItems('hoofddeksel').subscribe(items => {
				this.shopDetails = items;
				this.filteredShop = this.filterShop();
			}, (err) => {
				console.error(err);
			});
		}, (err) => {
			console.error(err);
		});

		// Set initial amount of columns for items in the shop.
		this.setItemColumns();

		// Set page title.
		this.titleService.setTitle('Shop' + titleTrail);
	}

	/**
	 * Method to change categoty of items you are looking at in the shop.
	 * @param event Event triggered by changing tab/category.
	 * @return
	 */
	public tabChange(event: MatTabChangeEvent): void {
		this.shopService.getCategoryItems(event.tab.textLabel).subscribe(items => {
			this.shopDetails = items;
			this.filteredShop = this.filterShop();
		}, (err) => {
			console.error(err);
		});
	}

	/** Method to buy and item from the shop and add it to the users inventory and update the milestone if needed
	 * @param item Item that is bought by the user.
	 * @return
	 */
	public buy(item: Item): void {
		this.shopService.buy(item).subscribe((data: any) => {
			if (data.succes) {
				this.snackBar.open(data.message, 'X', { duration: 2000, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					this.milestoneUpdates.updateMilestone(milestones[2], 1).subscribe(data => {
						if (data.completed) {
							this.milestoneUpdates.updateRecent(`${new Date().toLocaleDateString()}: Je hebt de badge 'Gierige Gerrie' verdiend!`).subscribe();
							this.snackBar.open('\uD83C\uDF89 Gefeliciteerd! Je hebt de badge \'Gierige Gerrie\' verdiend! \uD83C\uDF89', 'X', {
								duration: 4000,
								panelClass: ['style-succes']
							});
						}
						this.milestoneUpdates.updateMilestone(milestones[4], 1).subscribe(data => {
							if (data.completed) {
								this.milestoneUpdates.updateRecent(`${new Date().toLocaleDateString()}: Je hebt de badge 'Shoppaholic' verdiend`).subscribe();
								this.snackBar.open('\uD83C\uDF89 Gefeliciteerd! Je hebt de badge \'Shoppaholic\' verdiend! \uD83C\uDF89', 'X', {
									duration: 4000,
									panelClass: ['style-succes']
								});
							}
							window.location.reload();
						});
					});
				});
			} else {
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-error'] });
			}
		});
	}

	/** Method to filter the shop based on if the user already owns the item.
	 * @return List of items that comply to the applied filter.
	 */
	private filterShop(): Item[] {
		return this.shopDetails.filter(x => {
			return this.userDetails.inventory.find(y => y._id === x._id) == null;
		});
	}

	/**
	 * Method that sets the initial amount of columns based on screen width.
	 * @return
	 */
	private setItemColumns(): void {
		const screenWidth = window.innerWidth;

		if (screenWidth >= 1280) {
			this.itemColumns = 5;
		} else if (screenWidth < 1280 && screenWidth >= 1050) {
			this.itemColumns = 4;
		} else if (screenWidth < 1050 && screenWidth >= 820) {
			this.itemColumns = 3;
		} else if (screenWidth < 820 && screenWidth >= 590) {
			this.itemColumns = 2;
		} else if (screenWidth < 500) {
			this.itemColumns = 1;
		}
	}

	/**
	 * Method that changes the amount of columns when the window size changes.
	 * @param event Event triggered when the screen changes size.
	 * @return
	 */
	public onResize(event): void {
		const screenWidth = event.target.innerWidth;

		if (screenWidth >= 1280) {
			this.itemColumns = 5;
		} else if (screenWidth < 1280 && screenWidth >= 1050) {
			this.itemColumns = 4;
		} else if (screenWidth < 1050 && screenWidth >= 820) {
			this.itemColumns = 3;
		} else if (screenWidth < 820 && screenWidth >= 590) {
			this.itemColumns = 2;
		} else if (screenWidth < 500) {
			this.itemColumns = 1;
		}
	}
}
