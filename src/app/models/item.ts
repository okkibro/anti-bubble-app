/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Models
 */

/**
 * This class represents the database model for an Item from the shop used in the front-end.
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