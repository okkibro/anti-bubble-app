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
 * This class represents the database model for an Article used in the front-end.
 */

export class Article {
	articlenr: number;
	part: number;
	image: string;
	source: string;
}