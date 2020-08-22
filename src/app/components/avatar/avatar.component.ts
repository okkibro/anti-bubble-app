/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * avatar.component.ts
 * This file is responsible for the 'avatar' page in the app. The file contains methods
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Item } from '../../models/item';
import { ShopService } from 'src/app/services/shop.service';
import { AvatarService } from 'src/app/services/avatar.service';
import { AvatarDisplayComponent } from '../avatar-display/avatar-display.component';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

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
	itemCategories: string[] = [
		'Hoofddeksel',
		'Haar',
		'Bril',
		'Shirt',
		'Broek',
		'Schoenen',
		'Medaille'
	];
	itemColumns: number;

	/**
	 * AvatarComponent constructor.
	 * @param shopService
	 * @param avatarService
	 * @param avatarDisplay
	 * @param titleService
	 * @param userService
	 */
	constructor(
		private shopService: ShopService,
		private avatarService: AvatarService,
		private avatarDisplay: AvatarDisplayComponent,
		private titleService: Title,
		private userService: UserService
	) { }

	/**
	 * Initialization method.
	 * @returns
	 */
	ngOnInit(): void {
		this.shopService.getCategoryItems('hoofddeksel').subscribe(items => {
			this.userService.profile().subscribe(user => {
				this.userDetails = user;

				// Checks for items in the shop that the player bought
				for (let i = 0; i < items.length; i++) {
					if (user.inventory.find(x => x._id == items[i]._id) != null) {
						this.itemsShown.push(items[i]);
						this.filteredAvatar = this.filterAvatar();
					}
				}
				this.avatarDisplay.showAvatar(user);
			});
		});

		this.setItemColumns();

		this.titleService.setTitle('Avatar' + environment.TITLE_TRAIL);
	}

	/**
	 * Method that assigns an item to the user's avatar in the database.
	 * @param item Item to be equipped by the user.
	 * @returns
	 */
	equip(item: Item): void {
		this.avatarService.equip(item).subscribe(data => {

			// Updates the image shown to the player without reloading the page.
			if (data.category == 'haar') {
				document.getElementById('haar1').setAttribute('src', data.imageFull2);
				document.getElementById('haar2').setAttribute('src', data.imageFull);
			} else {
				document.getElementById(data.category).setAttribute('src', data.imageFull);
			}
		});
	}

	/**
	 * Method to change the tab in the HTML and updates the shown items.
	 * @param event Event triggered by changing tab/category.
	 * @returns
	 */
	tabChange(event: MatTabChangeEvent): void {
		this.shopService.getCategoryItems(event.tab.textLabel).subscribe(items => {
			this.itemsShown = items;
			this.filteredAvatar = this.filterAvatar();
		}, (err) => {
			console.error(err);
		});
	}

	/**
	 * Method to filter the avatar items to only show the items in the inventory/that the player bought.
	 * @returns List of items currently owned by the user.
	 */
	filterAvatar(): AvatarComponent[] {
		return this.itemsShown.filter(x => {
			return this.userDetails.inventory.find(y => x._id == y._id) != null;
		});
	}

	/**
	 * Method that sets the initial amount of columns based on screen width.
	 * @returns
	 */
	setItemColumns(): void {
		const screenWidth = window.innerWidth;

		if (screenWidth >= 1000) {
			this.itemColumns = 3;
		} else if (screenWidth < 1000) {
			this.itemColumns = 2;
		}
	}

	/**
	 * Method that changes the amount of columns when the window size changes.
	 * @param event Event triggered when the screen changes size.
	 * @returns
	 */
	onResize(event): void {
		const screenWidth = event.target.innerWidth;

		if (screenWidth >= 1000) {
			this.itemColumns = 3;
		} else if (screenWidth < 1000) {
			this.itemColumns = 2;
		}
	}
}