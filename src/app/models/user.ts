/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Models
 */

import { Gender } from './gender';
import { Item } from './item';
import { Milestone } from './milestone';
import { Role } from './role';

/**
 * This class represents the database model for a User used in the front-end.
 */

export class User {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: Role;
	gender: Gender;
	password: string;
	salt: string;
	recoverPasswordToken: string;
	recoverPasswordExpires: Date;
	inventory: Item[];
	currency: number;
	milestones: Milestone[];
	classArray: string[];
	avatar: any;
	scoreboard: string[];
	classUpdates: string[];
	bubbleInit: boolean;
	labyrinthAnswers: number[];
	bubble: any;
}