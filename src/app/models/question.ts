/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

export class Question {
	id: number;
	question: string;
	part: number;
	choiceConsequences: [string];
	choices: [string];
	multipleAnswers: boolean;
}