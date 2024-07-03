import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

const path = process.env.NODE_ENV !== 'development' ? `./config/.env.${process.env.NODE_ENV}` : `./config/.env`;
dotenv.config({ path });

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.token as string;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY!, (err: jwt.VerifyErrors | null, user: any) => {
            if (err) return res.status(403).json('Token is not valid!');
            req.user = user;
            next();
        });
    } else {
        res.status(401).json('You are not authenticated!');
    }
};

const verifyTokenAndAuthorization = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if ((req.user as any).id === Number(req.params.id) || (req.user as any).role === 'ROLE_ADMIN') {
            next();
        } else {
            res.status(403).json('You are not allowed to do that!');
        }
    });
};

const verifyTokenAndEmploye = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if ((req.user as any).role === 'ROLE_EMPLOYE' || (req.user as any).role === 'ROLE_ADMIN') {
            next();
        } else {
            res.status(403).json('You are not allowed to do that!');
        }
    });
};

const verifyTokenAndAdmin = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if ((req.user as any).role === 'ROLE_ADMIN') {
            next();
        } else {
            res.status(403).json('You are not allowed to do that!');
        }
    });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndEmploye, verifyTokenAndAdmin };
