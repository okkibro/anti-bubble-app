/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This class represents the database model for an Activity used in the front-end.
 */

export class Activity {
	name: string;
	category: string;
	description: string;
	goal: string;
	explanation: string;
	timed: boolean;
	teams: boolean;
}