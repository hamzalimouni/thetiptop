import passport, { DoneCallback, use } from 'passport';
import PGO, { Profile, VerifyCallback } from 'passport-google-oauth20';
import prisma from '../../prisma/db';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { refreshTokens } from '../controllers/authController';

const path = process.env.NODE_ENV !== 'development' ? `./config/.env.${process.env.NODE_ENV}` : `./config/.env`;
dotenv.config({ path });

const jwtSecretKey = process.env.JWT_SECRET_KEY!;
const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY!;

const GoogleStrategy = PGO.Strategy;
const clientID = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET_KEY!;
passport.use(
    new GoogleStrategy(
        {
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken: string, refreshAccessToken: string, profile: Profile, done) => {
            const email = profile.emails?.[0].value;
            let user = await prisma.users.findUnique({
                where: {
                    email: email,
                },
            });
            if (!user) {
                user = await prisma.users.create({
                    data: {
                        firstname: profile.name?.givenName || '',
                        lastname: profile.name?.familyName || '',
                        email: email || '',
                        img: profile._json?.picture,
                        typeInscription: 'GOOGLE',
                        password: '',
                    },
                });
            }
            const { password, ...others } = user;
            const token: string = jwt.sign(
                {
                    id: user.id,
                    role: user.role,
                },
                jwtSecretKey,
                {
                    expiresIn: '1d',
                }
            );
            const refreshToken: string = jwt.sign(
                {
                    id: user.id,
                    role: user.role,
                },
                jwtRefreshSecretKey
            );
            refreshTokens.push(refreshToken);
            done(null, { token, others: others, refreshToken: refreshToken, googleToken: accessToken });
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((user: any, done) => {
    done(null, user);
});
