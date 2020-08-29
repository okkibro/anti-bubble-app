/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Role } from './role';

/**
 * This class represents the model for tokenData, which is the sensitive user data
 * that is stored in the browser's cookies and is used a bunch for things like authentication and
 * authorization.
 */

export class tokenData {
	email: string;
	role: Role;
	exp: number;
}