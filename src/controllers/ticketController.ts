import { Request, Response } from 'express';
import prisma from '../../prisma/db';
import { Tickets } from '@prisma/client';
import * as dotenv from 'dotenv';
import Mailjet from 'node-mailjet';
import QRCode from 'qrcode';

const path = process.env.NODE_ENV !== 'development' ? `./config/.env.${process.env.NODE_ENV}` : `./config/.env`;
dotenv.config({ path });

const mailjetApiKey = process.env.MAILJET_API_KEY!;
const mailjetApiSecret = process.env.MAILJET_SECRET_KEY!;

export const getTickets = async (req: Request, res: Response) => {
    const page: number = Number(req.query.page as string) || 1;
    const pageSize: number = Number(req.query.pageSize as string) || 16;
    const skip: number = (page - 1) * pageSize;
    try {
        const tickets = await prisma.tickets.findMany({
            skip,
            take: pageSize,
            include: {
                profit: true,
                author: {
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
                },
                employe: {
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
                },
            },
        });
        return res.status(200).json(tickets);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getTicket = async (req: Request, res: Response) => {
    const code: string = req.params.code;
    try {
        const existingTicket: Tickets | null = await prisma.tickets.findUnique({
            where: { code },
        });

        if (!existingTicket || existingTicket?.printed === false) return res.status(404).json({ error: 'Ticket not found!' });

        const ticket = await prisma.tickets.findUnique({
            where: { code },
            select: {
                id: true,
                code: true,
                dateOfUse: true,
                profit: true,
                author: {
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
                },
                profitId: true,
                authorId: true,
                given: true,
                dateOfGiven: true,
                status: true,
            },
        });
        return res.status(200).json(ticket);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUsedTicket = async (req: Request, res: Response) => {
    const code: string = req.params.code;
    try {
        const existingTicket: Tickets | null = await prisma.tickets.findUnique({
            where: { code },
        });

        if (!existingTicket || existingTicket?.printed === false) return res.status(404).json({ error: 'Ticket not found' });

        const ticket = await prisma.tickets.findUnique({
            where: { code },
            select: {
                id: true,
                code: true,
                dateOfUse: true,
                profit: true,
                author: {
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
                },
                profitId: true,
                authorId: true,
                given: true,
                dateOfGiven: true,
                status: true,
            },
        });
        if (ticket?.status === true) return res.status(400).json({ error: 'Ticket not used' });
        return res.status(200).json(ticket);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserTickets = async (req: Request, res: Response) => {
    const authorId: number = Number((req?.user as any)?.id);
    try {
        const tickets = await prisma.tickets.findMany({
            where: { authorId },
            select: {
                id: true,
                code: true,
                dateOfUse: true,
                profit: true,
                author: {
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
                },
                profitId: true,
                authorId: true,
                given: true,
                dateOfGiven: true,
                status: true,
            },
            orderBy: {
                dateOfUse: 'desc',
            },
        });

        return res.status(200).json(tickets);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const userUpdateTicket = async (req: Request, res: Response) => {
    const id: number = Number(req.body.id);
    const authorId: number = (req?.user as any)?.id;
    try {
        const existingTicket: Tickets | null = await prisma.tickets.findUnique({
            where: { id },
        });
        if (!existingTicket || existingTicket?.printed === false) return res.status(404).json({ error: 'Ticket not found!' });

        const ticket = await prisma.tickets.update({
            where: { id },
            data: {
                authorId,
                dateOfUse: new Date(Date.now()),
                status: false,
            },
            select: {
                id: true,
                code: true,
                dateOfUse: true,
                profit: true,
                author: {
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
                },
                profitId: true,
                authorId: true,
                given: true,
                dateOfGiven: true,
                status: true,
            },
        });

        const qrCodeData = `https://dsp5-archi-f23-15m-g4.fr/gain/${ticket.code}`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);

        const mailjet = Mailjet.apiConnect(mailjetApiKey, mailjetApiSecret);
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'thetiptop@dsp5-archi-f23-15m-g4.fr',
                        Name: 'Thé tiptop',
                    },
                    To: [
                        {
                            Email: ticket.author?.email,
                            Name: ticket.author?.firstname + ' ' + ticket.author?.lastname,
                        },
                    ],
                    Subject: 'Félicitations! Vous avez gagné un prix! 🎉🥳',
                    HTMLPart: `<!DOCTYPE html>
                    <html lang="en"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
                    <body style="background-color: #FFFFFF; font-family: Pangram, Verdana; margin:0 !important"><div style="max-width: 600px; background-color: white; margin:0 auto">
                    <div style='text-align:center; margin: 20px;'><img alt='Thé Tiptop' width='160' src='https://dsp5-archi-f23-15m-g4.fr/logo.png'></div>
                    <div style='padding: 20px; font-size: 14px;'><p>Bonjour,<br/>
                    <p>Nous avons le plaisir de vous annoncer que vous avez remporté un prix à notre jeu de la roue tournante! 🎉🥳 </p>
                    <p>Votre gain est de : </p>
                    <p style='background: #eaeaea !important; padding: 15px; border-radius: 15px; max-width: 75%; margin: 0 auto; text-align: center; font-family: monospace;'>
                    ${ticket?.profit?.libelle}
                    <br/>
                    <img src='cid:qrcode' alt='QR Code' style='max-width: 100%; height: auto; border-radius: 15px; margin-top: 20px;'>
                    </p>
                    <p>Pour récupérer votre gain, veuillez présenter ce message au comptoir.</p>
                    Bien à vous, <br/>
                    <div style='background: url(""); background-size: cover; background-position: bottom; padding: 30px; border-radius: 16px; margin-top: 40px; font-size: 10px; color: #3C3C3B; text-align: center;'>
                        <div style='margin-top:10px'>Thé Tiptop, <br/></div>
                        </div></div></body></div></div></html>`,
                    InlinedAttachments: [
                        {
                            ContentType: 'image/png',
                            Filename: 'QrCode.png',
                            ContentID: 'qrcode',
                            Base64Content: qrCodeImage.split('base64,')[1],
                        },
                    ],
                },
            ],
        });
        request
            .then((result: any) => {
                console.log(result.body);
            })
            .catch((err: any) => {
                console.log(err.statusCode);
            });
        return res.status(200).json(ticket);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const employeUpdateTicket = async (req: Request, res: Response) => {
    const id: number = req.body.id;
    const employeId: number = (req?.user as any)?.id;
    try {
        const existingTicket: Tickets | null = await prisma.tickets.findUnique({
            where: { id },
        });

        if (!existingTicket || existingTicket?.printed === false) return res.status(404).json({ error: 'Ticket not found!' });

        await prisma.tickets.update({
            where: { id },
            data: {
                employeId,
                dateOfGiven: new Date(Date.now()),
                given: true,
            },
        });
        return res.status(200).json('Ticket has been updated');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getRandomTicket = async (req: Request, res: Response) => {
    try {
        const currentDate = new Date(Date.now());
        const config = await prisma.config.findUnique({
            where: {
                id: 1,
            },
        });
        if (config && currentDate <= config?.dateOfEnd) {
            const totalTickets = await prisma.tickets.count({
                where: {
                    printed: false,
                },
            });
            const randomTicketIndex = Math.floor(Math.random() * totalTickets);
            const randomTicket = await prisma.tickets.findFirst({
                skip: randomTicketIndex,
                select: {
                    id: true,
                    code: true,
                },
            });
            if (!randomTicket) {
                return res.status(404).json({ error: 'No tickets available' });
            }
            return res.status(200).json(randomTicket);
        }
        return res.status(404).json({ error: 'The game is finished' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const printTicket = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const printerId: number = (req?.user as any)?.id;
    const email: string = req.body.email;
    try {
        const existingTicket: Tickets | null = await prisma.tickets.findUnique({
            where: { id },
        });
        if (!existingTicket) return res.status(404).json({ error: 'Ticket not found!' });

        await prisma.tickets.update({
            where: { id },
            data: {
                printed: true,
                printerId,
                dateOfPrint: new Date(Date.now()),
            },
        });
        await prisma.profits.update({
            where: { id: existingTicket.profitId },
            data: {
                quantityRemaining: {
                    increment: 1,
                },
            },
        });
        if (email && email !== '') {
            const mailjet = Mailjet.apiConnect(mailjetApiKey, mailjetApiSecret);
            const request = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: 'thetiptop@dsp5-archi-f23-15m-g4.fr',
                            Name: 'Thé tiptop',
                        },
                        To: [
                            {
                                Email: email,
                            },
                        ],
                        Subject: 'Profitez de votre cadeau spécial après votre achat! 🎁',
                        // TextPart: '',
                        HTMLPart: `<!DOCTYPE html>
                    <html lang="en"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
                    <body style="background-color: #FFFFFF; font-family: Pangram, Verdana; margin:0 !important"><div style="max-width: 600px; background-color: white; margin:0 auto">
                    <div style='text-align:center; margin: 20px;'><img alt='Thé Tiptop' width='160' src='https://dsp5-archi-f23-15m-g4.fr/logo.png'></div>
                    <div style='padding: 20px; font-size: 14px;'><p>Bonjour,<br/>
                    <p>Suite à votre achat sur notre magasin, nous sommes ravis de vous offrir la chance de jouer à notre jeu exclusif! 🎉🥳 </p>
                    <p>Le jeu est 100% gagnant. Voici le code qui vous permettra de participer: </p>
                    <p style='background: #eaeaea !important; padding: 15px; border-radius: 15px; max-width: 75%; margin: 0 auto; text-align: center; font-family: monospace;'>
                        ${existingTicket.code}
                    </p>
                        <p>Rendez-vous sur <a href='https://dsp5-archi-f23-15m-g4.fr/roulette'>ThéTipTop Roulette</a> pour jouer dès maintenant!</p>
                    Bien à vous, <br/>
                    <div style='background: url(""); background-size: cover; background-position: bottom; padding: 30px; border-radius: 16px; margin-top: 40px; font-size: 10px; color: #3C3C3B; text-align: center;'>
                        <div style='margin-top:10px'>Thé Tiptop, <br/></div>
                        </div></div></body></div></div></html>`,
                    },
                ],
            });
            request
                .then((result: any) => {
                    console.log(result.body);
                })
                .catch((err: any) => {
                    console.log(err.statusCode);
                });
        }
        return res.status(200).json('Ticket has been printed successfully');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const sendEmail = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    try {
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (!existingUser) return res.status(404).json({ error: 'User not found' });

        if (email && email !== '') {
            const mailjet = Mailjet.apiConnect(mailjetApiKey, mailjetApiSecret);
            const request = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: 'thetiptop@dsp5-archi-f23-15m-g4.fr',
                            Name: 'Thé tiptop',
                        },
                        To: [
                            {
                                Email: email,
                            },
                        ],
                        Subject: 'Félicitations! Vous êtes le grand gagnant de notre jeu-concours! 🎉🥳',
                        HTMLPart: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        </head>
                        <body style="background-color: #FFFFFF; font-family: Pangram, Verdana; margin:0 !important">
                        <div style="max-width: 600px; background-color: white; margin:0 auto">
                            <div style='text-align:center; margin: 20px;'><img alt='Thé Tiptop' width='160' src='https://dsp5-archi-f23-15m-g4.fr/logo.png'></div>
                            <div style='padding: 20px; font-size: 14px;'>
                                <p>Bonjour,<br/>
                                <p>Félicitations! Vous êtes le gagnant d'un an de thé d'une valeur de 360 €!</p>
                                <p>Vous avez remporté ce prix suite à votre participation à notre jeu exclusif! 🎉🥳</p>
                                <p>Pour réclamer votre prix, merci de présenter cet email au magasin.</p>
                            Bien à vous, <br/>
                            <div style='background: url(""); background-size: cover; background-position: bottom; padding: 30px; border-radius: 16px; margin-top: 40px; font-size: 10px; color: #3C3C3B; text-align: center;'>
                                <div style='margin-top:10px'>Thé Tiptop, <br/></div>
                            </div>
                        </div>
                        </body>
                        </html>
                        `,
                    },
                ],
            });
            request
                .then((result: any) => {
                    console.log(result.body);
                })
                .catch((err: any) => {
                    console.log(err.statusCode);
                });
        }
        const config = await prisma.config.update({
            where: {
                id: 1,
            },
            data: {
                status: false,
            },
        });
        return res.status(201).json(config);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
