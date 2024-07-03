import { Request, Response } from 'express';
import prisma from '../../prisma/db';

export const getTicketsStats = async (req: Request, res: Response) => {
    try {
        const usedTickets = await prisma.tickets.count({
            where: {
                status: false,
            },
        });
        const unusedTickets = await prisma.tickets.count({
            where: {
                status: true,
            },
        });
        const takedTickets = await prisma.tickets.count({
            where: {
                given: true,
                status: false,
            },
        });
        return res.status(200).json({ usedTickets, unusedTickets, takedTickets });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getTopParticipants = async (req: Request, res: Response) => {
    try {
        const usersWithTicketCount = await prisma.users.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                img: true,
                tickets: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: {
                tickets: {
                    _count: 'desc',
                },
            },
            take: 5,
        });
        return res.status(200).json(usersWithTicketCount);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getNewslettersInfo = async (req: Request, res: Response) => {
    try {
        const actifNewsletters = await prisma.newsletters.count({
            where: {
                status: true,
            },
        });
        const inactifNewsletters = await prisma.newsletters.count({
            where: {
                status: false,
            },
        });
        return res.status(200).json({ actifNewsletters, inactifNewsletters });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getProfitsInfo = async (req: Request, res: Response) => {
    try {
        const profitsInfo = await prisma.profits.findMany({
            select: {
                libelle: true,
                quantityTotal: true,
                quantityRemaining: true,
            },
        });
        const profitsArray = profitsInfo.map((profit) => [profit.libelle, profit.quantityTotal - profit.quantityRemaining, profit.quantityRemaining]);
        return res.status(200).json(profitsArray);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
