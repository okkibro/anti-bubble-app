import { Role } from './role';

export class User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
    salt: string;
    exp: number;
}