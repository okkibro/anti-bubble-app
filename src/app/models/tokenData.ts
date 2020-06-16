import { Role } from './role';

export class tokenData {
    _id: string;
    email: string;
    role: Role;
    exp: number;
    iat: number;
}