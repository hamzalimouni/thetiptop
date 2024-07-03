import { Gender, InscriptionType, Roles } from '@prisma/client';

export type User = {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    gender: Gender;
    role: Roles;
    password: string;
    birth: string;
    img?: string;
    typeInscription?: InscriptionType;
    status?: boolean;
};

export type LoginUser = {
    email: string;
    password: string;
};

export type Ticket = {
    id?: number;
    code: string;
    authorId: number;
    profitId: number;
    dateOfUse?: Date | null;
    given?: boolean;
    dateOfGiven?: Date | null;
    status?: boolean;
    printerId: number | null;
    printed: boolean;
    dateOfPrint: Date | null;
};
