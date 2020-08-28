/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file contains the exported TypeScript class/model for an Item from the shop used in the front-end.
 * @packageDocumentation
 */

export class Item {
	_id: string;
	title: string;
	category: string;
	previewImage: string;
	fullImage: string;
	fullImage2: string;
	price: number;
	initial: boolean;
}