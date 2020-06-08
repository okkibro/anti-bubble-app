import { Role } from './role';

export class Shop {
    _id: string;
    title: string;
    category: string;
    previewImage: string;
    fullImage: string;
    fullImage2: string;
    price: number;
    role: Role;
    exp: number;
}