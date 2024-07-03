import { Request, Response } from 'express';
import prisma from '../../prisma/db';
import { Newsletters } from '@prisma/client';
import Joi from 'joi';

const newsletterSchema = Joi.object({
    email: Joi.string().email().required(),
    status: Joi.boolean().optional(),
});

export const getNewsletters = async (req: Request, res: Response) => {
    try {
        const newsletters: Newsletters[] = await prisma.newsletters.findMany();
        const count: number = await prisma.newsletters.count();
        return res.status(200).json({ data: newsletters, count });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getNewsletter = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    try {
        const newsletter: Newsletters | null = await prisma.newsletters.findUnique({
            where: { id },
        });

        if (!newsletter) return res.status(404).json({ error: 'newsletter not found!' });
        return res.status(200).json(newsletter);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createNewsletter = async (req: Request, res: Response) => {
    const data: Newsletters = req.body;
    const { error } = newsletterSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const existingNewsletter = await prisma.newsletters.findUnique({
            where: { email: data.email },
        });
        if (existingNewsletter) return res.status(403).json({ error: 'newsletter already exist!' });

        await prisma.newsletters.create({
            data,
        });
        return res.status(201).json('Newsletter has been inserted');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateNewsletter = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const data: Newsletters = req.body;
    const { error } = newsletterSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const existingNewsletter = await prisma.newsletters.findUnique({
            where: { id },
        });
        if (!existingNewsletter) return res.status(404).json({ error: 'newsletter not found' });

        await prisma.newsletters.update({
            where: { id },
            data,
        });
        return res.status(201).json('Newsletter has been updated');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteNewsletter = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    try {
        const existingNewsletter = await prisma.newsletters.findUnique({
            where: { id },
        });

        if (!existingNewsletter) return res.status(404).json({ error: 'newsletter not found' });

        await prisma.newsletters.delete({
            where: { id },
        });
        return res.status(204).json('Newsletter has been deleted');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
