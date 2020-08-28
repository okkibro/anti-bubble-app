/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * This file contains the exported TypeScript class/model for a Question in the initial labyrinth the user
 * goes through to form their original bubble used in the front-end.
 * @packageDocumentation
 */

export class Question {
	id: number;
	question: string;
	part: number;
	choiceConsequences: string[];
	choices: string[];
	multipleAnswers: boolean;
}
