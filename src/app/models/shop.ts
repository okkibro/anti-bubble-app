import { Role } from './role';

export class Shop {
    _id: string;
    title: string;
    category: string;
    image: string;
    price: number;
    role: Role;
    exp: number;
}