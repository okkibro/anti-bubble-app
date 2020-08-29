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
 * This class represents the database model for a Question in the initial labyrinth a user
 * goes through to form their original filter bubble used in the front-end.
 */

export class Question {
	id: number;
	question: string;
	part: number;
	choiceConsequences: string[];
	choices: string[];
	multipleAnswers: boolean;
}
