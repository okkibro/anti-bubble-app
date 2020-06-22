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
    classCode: number;
    salt: string;
    exp: number;
    currency: number;
    inventory: [ShopItem];
    milestones: [Milestone];
    class: string;
    knowledge: [number];
    diversity: [number];
    recentMilestones: [String];
    bubbleInit: boolean;
    avatar: any;
    labyrinthAnswers: [number];
    bubble: any;
}