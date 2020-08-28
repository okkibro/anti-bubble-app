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
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { AvatarService } from 'src/app/services/avatar.service';
import { ShopService } from 'src/app/services/shop.service';
import { titleTrail } from '../../../../constants';
import { Item } from '../../models/item';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
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
	itemCategories: string[] = [
		'Hoofddeksel',
		'Haar',
		'Bril',
		'Shirt',
		'Broek',
		'Schoenen',
		'Medaille',
		'Lichaam'
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
	 * @return
	 */
	ngOnInit(): void {
		this.userService.profile().subscribe(user => {
			this.userDetails = user;
			this.shopService.getCategoryItems('hoofddeksel').subscribe(items => {

				// Checks for items in the shop that the player bought
				for (let i = 0; i < items.length; i++) {
					if (user.inventory.find(x => x._id === items[i]._id) != null) {
						this.itemsShown.push(items[i]);
						this.filteredAvatar = this.filterAvatar();
					}
				}
				this.avatarDisplay.showAvatar(user);
			});
		});

		this.setItemColumns();

		// Set page title.
		this.titleService.setTitle('Avatar' + titleTrail);
	}

	/**
	 * Method that assigns an item to the user's avatar in the database.
	 * @param item Item to be equipped by the user.
	 * @return
	 */
	equip(item: Item): void {
		this.avatarService.equip(item).subscribe(data => {

			// Updates the image shown to the player without reloading the page.
			if (data.category === 'haar') {
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
	 * @return
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
	 * @return List of items currently owned by the user.
	 */
	filterAvatar(): AvatarComponent[] {
		return this.itemsShown.filter(x => {
			return this.userDetails.inventory.find(y => x._id === y._id) != null;
		});
	}

	/**
	 * Method that sets the initial amount of columns based on screen width.
	 * @return
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
	 * @return
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