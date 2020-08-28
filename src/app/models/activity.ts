/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file contains the exported TypeScript class/model for an Activity used in the front-end.
 * @packageDocumentation
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