import { Request, Response } from 'express';
import prisma from '../../prisma/db';
import { Config } from '@prisma/client';

export const getConfig = async (req: Request, res: Response) => {
    try {
        const config: Config | null = await prisma.config.findUnique({
            where: { id: 1 },
        });
        if (!config) return res.status(404).json({ error: 'Config not found' });
        return res.status(200).json(config);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
