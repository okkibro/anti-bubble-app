import { Role } from './role';

export class Shop {
    _id: string;
    title: string;
    category: string;
    previewImage: string;
    fullImage: string;
    price: number;
    role: Role;
    exp: number;
}