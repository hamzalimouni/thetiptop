import { Request, Response } from 'express';
import prisma from '../../prisma/db';
import { Profits } from '@prisma/client';

export const getProfits = async (req: Request, res: Response) => {
    try {
        const profits: Profits[] = await prisma.profits.findMany();
        return res.status(200).json(profits);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getProfit = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    try {
        const existingProfit = await prisma.profits.findUnique({
            where: { id },
        });

        if (!existingProfit) return res.status(404).json({ error: 'Profit not found' });

        const profit: Profits | null = await prisma.profits.findUnique({
            where: { id },
        });
        return res.status(200).json(profit);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
