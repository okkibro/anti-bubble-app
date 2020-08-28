/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Activity } from './activity';
import { Class } from './class';
import { User } from './user';

export class Log {
	_id: string;
	activity: Activity;
	answers: string[];
	class: Class;
	questions: string[];
	students: string[];
	user: User;
}