/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Role } from './role';
import { ShopItem } from './shopItem'
import { Milestone } from './milestone'

export class User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
    salt: string;
    recoverPasswordToken: string;
    recoverPasswordExpires: Date;
    inventory: [ShopItem];
    currency: number;
    milestones: [Milestone];
    class: [string];
    avatar: any;
    recentMilestones: [string];
    bubbleInit: boolean;
    labyrinthAnswers: [Number];
    bubble: any;
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */