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
}