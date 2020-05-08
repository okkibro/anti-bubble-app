import { Role } from './role';
import { Milestone } from './milestone'

export class User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
    salt: string;
    exp: number;
    milestones: [Milestone];
}