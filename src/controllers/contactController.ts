import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import Mailjet from 'node-mailjet';
import Joi from 'joi';

const path = process.env.NODE_ENV !== 'development' ? `./config/.env.${process.env.NODE_ENV}` : `./config/.env`;
dotenv.config({ path });

const mailjetApiKey = process.env.MAILJET_API_KEY!;
const mailjetApiSecret = process.env.MAILJET_SECRET_KEY!;

type Contact = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
});

export const contact = async (req: Request, res: Response) => {
    const data: Contact = req.body;
    const { error } = contactSchema.validate(data);
    if (error) return res.status(400).json({ message: error.details[0].message });
    try {
        const mailjet = Mailjet.apiConnect(mailjetApiKey, mailjetApiSecret);
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'thetiptop@dsp5-archi-f23-15m-g4.fr',
                        Name: data.name,
                    },
                    To: [
                        {
                            Email: 'thetiptop@dsp5-archi-f23-15m-g4.fr',
                            Name: 'Thé tiptop',
                        },
                    ],
                    Subject: data.subject,
                    TextPart: data.message,
                    ReplyTo: {
                        Email: data.email,
                        Name: data.name,
                    },
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
        return res.status(201).json('Email sent successfully');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
