import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../../prisma/db';
import { User } from '../types/types';
import { UserInterface } from '../types/interfaces';
import Joi from 'joi';

const userSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().optional(),
    role: Joi.string().required(),
    gender: Joi.string().optional(),
    phone: Joi.string().optional(),
    birth: Joi.string().optional(),
    status: Joi.boolean().optional(),
});

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                gender: true,
                birth: true,
                phone: true,
                img: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                typeInscription: true,
            },
        });
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getEmployes = async (req: Request, res: Response) => {
    try {
        const employes = await prisma.users.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                gender: true,
                birth: true,
                phone: true,
                img: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                typeInscription: true,
            },
            where: {
                role: 'ROLE_EMPLOYE',
            },
        });
        return res.status(200).json(employes);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getWinnersUsers = async (req: Request, res: Response) => {
    try {
        const winnersUsers = await prisma.users.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                gender: true,
                birth: true,
                phone: true,
                img: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                typeInscription: true,
                tickets: {
                    include: {
                        profit: true,
                        employe: true,
                    },
                },
            },
            where: {
                tickets: {
                    some: {
                        id: {
                            not: 0,
                        },
                    },
                },
                status: true,
            },
        });
        return res.status(200).json(winnersUsers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUser = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    try {
        const existingUser = await prisma.users.findUnique({
            where: { id },
        });

        if (!existingUser) return res.status(404).json({ error: 'User not found' });

        const user = await prisma.users.findUnique({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                gender: true,
                birth: true,
                phone: true,
                img: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                typeInscription: true,
            },
            where: { id },
        });
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const postUser = async (req: Request, res: Response) => {
    const values: User = req.body;
    try {
        const existingUser = await prisma.users.findUnique({
            where: { email: values.email },
        });
        if (existingUser) return res.status(409).json({ error: 'User already exist!' });

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(values.password, salt);
        const user = await prisma.users.create({
            data: {
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
                phone: values.phone,
                gender: values.gender,
                role: values.role,
                password: hashedPassword,
                birth: new Date(values.birth),
                typeInscription: 'CLASSIC',
                status: values.status,
            },
        });
        if (!user) return res.status(500).json({ error: 'User has not been created' });
        return res.status(201).json({ success: 'User has been created' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const id: number = (req.user as any).id;
    const values: UserInterface = req.body;
    try {
        const existingUser = await prisma.users.findUnique({
            where: { id },
        });
        if (!existingUser) return res.status(404).json({ error: 'User not found' });
        if (values.password && values.password !== '') {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(values.password, salt);
            values.password = hashedPassword;
        } else {
            delete values.password;
        }

        const updatedUser = await prisma.users.update({
            where: { id },
            data: { ...values, birth: new Date(values.birth) },
        });
        const { password, ...others } = updatedUser;
        return res.status(200).json({ success: 'User has been updated', user: others });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const id: number = (req.user as any).id;
    try {
        const existingUser = await prisma.users.findUnique({
            where: { id },
        });

        if (!existingUser) return res.status(404).json({ error: 'User not found' });

        await prisma.users.delete({
            where: { id },
        });
        return res.status(204).json('User has been deleted!');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
