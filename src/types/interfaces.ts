import { Gender, InscriptionType, Roles } from '@prisma/client';

export interface UserInterface {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    gender: Gender;
    role: Roles;
    password?: string;
    birth: string;
    img?: string;
    typeInscription?: InscriptionType;
    status?: boolean;
}

export interface TicketInterface {
    id?: number;
    code: string;
    authorId: number;
    profitId: number;
    dateOfUse?: Date | null;
    given?: boolean;
    status?: boolean;
}
