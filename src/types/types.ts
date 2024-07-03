export type Loading = {
    loading: boolean;
    title: string;
}

export type Profit = {
    id: number;
    libelle: string;
    percentage: number;
    quantityTotal: number;
    quantityRemaining: number;
    status: boolean;
    img: string;
}

export type Ticket = {
    id: number;
    code: string;
    dateOfUse: string | null;
    profit: Profit;
    author: User;
    autorId: number | null;
    employeId: number | null;
    profitId: number;
    given: boolean;
    dateOfGiven?: string | null;
    status: boolean;
}

export type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string | null;
    gender: string;
    role: string;
    birth: string;
    img: string | null;
    typeInscription: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    tickets?: Ticket[];
};

export type Newsletter = {
    id: number;
    email: string;
    status: boolean;
}

export type Blog = {
    id: number;
    title: string;
    desc: string;
    img: string;
    status: boolean;
}

export type Token = {
    token: string;
    refreshToken: string;
}

export type StatsTicket = {
    usedTickets: number;
    unusedTickets: number;
    takedTickets: number;
}

export type Config = {
    dateOfStart: string | null;
    dateOfEnd: string | null;
    dateOfValidate: string | null;
    status: boolean | null;
}

export type LoginData = {
    email: string;
    password: string;
}

export type UserInfo = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    gender: string;
    birth?: string;
    img?: string;
    createdAt: string;
}

export type NewslettersInfo = {
    actifNewsletters: number;
    inactifNewsletters: number;
}

export type ProfitsInfo = {
    profitId: number;
    usedTicketsCount: number;
    unusedTicketsCount: number;
}