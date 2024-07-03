import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieSession from 'cookie-session';
import './stratigies/passport';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import profitRoutes from './routes/profits';
import ticketRoutes from './routes/tickets';
import newsletterRoutes from './routes/newsletters';
import blogRoutes from './routes/blogs';
import configRoutes from './routes/configs';
import statsRoutes from './routes/stats';
import contactsRoutes from './routes/contacts';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
import prisma from '../prisma/db';
import crypto from 'crypto';

const pathEnv = process.env.NODE_ENV !== 'development' ? `./config/.env.${process.env.NODE_ENV}` : `./config/.env`;
dotenv.config({ path: pathEnv });

const app = express();
app.use(
    cors({
        origin: [/^http:\/\/localhost:5173$/, /^https:\/\/(?:.+\.)*dsp5-archi-f23-15m-g4\.fr$/],
        methods: 'GET, POST, PUT, DELETE',
        credentials: true,
    })
);
app.use(express.json());
app.use(
    cookieSession({
        name: 'session',
        keys: [process.env.COOKIE_SESSION_SECRET_KEY!],
        maxAge: 24 * 60 * 60 * 100,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profits', profitRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/profits', profitRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/configs', configRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contacts', contactsRoutes);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/');
    },
    filename: function (req, file, cb) {
        const customName = Date.now() + Math.round(Math.random() * 1e9) + file.originalname;
        cb(null, customName);
    },
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    return res.status(200).json(file.filename);
});

app.get('/api/getImage/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) {
        return res.status(200).sendFile(filePath);
    }
    return res.status(404).json({ error: 'File not found' });
});

app.delete('/api/deleteImage/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.status(200).json({ message: 'File deleted successfully' });
    }
    return res.status(404).json({ error: 'File not found' });
});

function generateTicketCode() {
    return crypto.randomBytes(5).toString('hex').toUpperCase();
}

function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createPrizeDistribution() {
    const distribution = [];
    for (let i = 0; i < 300000; i++) distribution.push(1); // 60%
    for (let i = 0; i < 100000; i++) distribution.push(2); // 20%
    for (let i = 0; i < 50000; i++) distribution.push(3); // 10%
    for (let i = 0; i < 30000; i++) distribution.push(4); // 6%
    for (let i = 0; i < 20000; i++) distribution.push(5); // 4%
    return shuffleArray(distribution);
}

app.get('/api/generate/tickets', async (req, res) => {
    let tickets = [];
    const prizeDistribution = createPrizeDistribution();

    for (let i = 0; i < prizeDistribution.length; i++) {
        let code = generateTicketCode();
        let profitId = prizeDistribution[i];
        tickets.push({ code, profitId });
    }

    try {
        const data = await prisma.tickets.createMany({
            data: tickets,
        });
        return res.status(200).json({ message: 'success', data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'error', error });
    }
});

export default app;
