import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/db';
import { LoginUser, User } from '../types/types';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import Joi from 'joi';

const path = process.env.NODE_ENV !== 'development' ? `./config/.env.${process.env.NODE_ENV}` : `./config/.env`;
dotenv.config({ path });

const jwtSecretKey = process.env.JWT_SECRET_KEY!;
const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY!;

const registerSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    gender: Joi.string().optional(),
    password: Joi.string().required(),
    birth: Joi.string().optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const register = async (req: Request, res: Response) => {
    const values: User = req.body;
    const { error } = registerSchema.validate(values);
    if (error) return res.status(400).json({ error: error.details[0].message });

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
                role: 'ROLE_USER',
                password: hashedPassword,
                birth: new Date(values.birth),
                typeInscription: values.typeInscription || 'CLASSIC',
                status: values.status,
            },
        });
        if (!user) return res.status(500).json({ error: 'User with invalid data!' });
        return res.status(201).json({ success: 'User has been created' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const generateAccessToken = (user: any) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        jwtSecretKey,
        {
            expiresIn: '1d',
        }
    );
};

const generateRefreshToken = (user: any) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
        },
        jwtRefreshSecretKey
    );
};

export let refreshTokens: string[] = [];
export const refresh = async (req: Request, res: Response) => {
    const refreshToken: string = req.body.refreshToken;
    try {
        if (!refreshToken) return res.status(401).json('You are not authenticated!');
        if (!refreshTokens.includes(refreshToken)) return res.status(403).json('Refresh token is not valid!');

        jwt.verify(refreshToken, jwtRefreshSecretKey, (err, user) => {
            err && console.log(err);
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            const newToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);

            refreshTokens.push(newRefreshToken);

            return res.status(200).json({
                token: newToken,
                refreshToken: newRefreshToken,
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const values: LoginUser = req.body;
    const { error } = loginSchema.validate(values);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: values.email,
                status: true,
            },
        });
        if (!user) return res.status(404).json({ error: 'User not found!' });

        const isPasswordValid = await bcrypt.compareSync(values.password, user.password);
        if (!isPasswordValid || user.status === false) return res.status(403).json({ error: 'Wrong credentials!' });
        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        const { id, role, password, ...others } = user;
        return res.status(201).json({ token, refreshToken, others });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const logout = async (req: Request, res: Response) => {
    const refreshToken: string = req.body.refreshToken;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    return res.status(200).json('You logged out successfully.');
};

export const forgetPassword = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    try {
        const user = await prisma.users.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(404).json({ status: 'User not found' });
        }

        const jwtSecretKey = process.env.JWT_SECRET_KEY!;
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            jwtSecretKey,
            {
                expiresIn: '1h',
            }
        );
        const link = `http://localhost:5173/reset-password/${token}`;

        // const transporter = nodemailer.createTransport({
        //     pool: true,
        //     host: 'ssl0.ovh.net',
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: 'contact@as-saintmaurice.fr',
        //         pass: 'ASsm01141003',
        //     },
        // });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hamzalimouni9@gmail.com',
                pass: 'jluw bxud wjmv syju',
            },
        });

        // const mailOptions = {
        //     from: 'thetiptop@contact.fr',
        //     to: user?.email,
        //     subject: 'Réinitialisation de votre mot de passe',
        //     text: `Vous avez demandé la réinitialisation de votre mot de passe pour votre compte https://the-tiptop.fr. \nPour procéder à cette réinitialisation, veuillez cliquer sur le lien ci-dessous pour accéder à la page de réinitialisation de mot de passe :
        //     \n\n${link}`,
        // };

        const mailOptions = {
            from: 'hamzalimouni9@gmail.com',
            to: user?.email,
            subject: 'Réinitialisation de votre mot de passe',
            text: `Vous avez demandé la réinitialisation de votre mot de passe pour votre compte https://the-tiptop.fr. \nPour procéder à cette réinitialisation, veuillez cliquer sur le lien ci-dessous pour accéder à la page de réinitialisation de mot de passe :
            \n\n${link}`,
        };

        transporter.sendMail(mailOptions, function (error: any, info: any) {
            if (error) return res.status(500).json({ status: 'failure' });
            return res.status(201).json({ status: 'success' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const token: string = req.params.token;
    const password: string = req.body.password;
    try {
        const oldUser = await prisma.users.findUnique({
            where: { id },
        });
        if (!oldUser) {
            return res.status(404).json({ status: 'User not found' });
        }
        const jwtSecretKey = process.env.JWT_SECRET_KEY!;
        jwt.verify(token, jwtSecretKey, async (err) => {
            if (err) return res.status(403).json({ Status: 'Token expired' });
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            await prisma.users.update({
                where: { id },
                data: { password: hashedPassword },
            });
            return res.status(201).json({ status: 'success' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
