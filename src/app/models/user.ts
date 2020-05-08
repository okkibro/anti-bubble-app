import { Role } from './role';
import { ShopItem } from './shopItem'

export class User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
    salt: string;
    exp: number;
    inventory: [ShopItem]
}