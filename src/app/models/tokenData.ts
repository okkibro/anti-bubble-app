/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Role } from './role';

export class tokenData {
    _id: string;
    email: string;
    role: Role;
    exp: number;
    iat: number;
}