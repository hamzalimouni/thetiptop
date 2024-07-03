import express from 'express';
import * as AuthController from '../controllers/authController';
import passport from 'passport';
import { verifyToken } from './verifyToken';

const router = express.Router();
// const CLIENT_URL = 'http://localhost:5173';
const CLIENT_URL = 'https://dsp5-archi-f23-15m-g4.fr';

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/token-logout', verifyToken, AuthController.logout);
router.post('/forget-password', AuthController.forgetPassword);
router.post('/reset-password/:id/:token', AuthController.resetPassword);
router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'failed',
    });
});
router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    }
});
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: CLIENT_URL,
        failureRedirect: '/login/failed',
    })
);
router.get('/logout', (req: any, res) => {
    req.logout();
    // res.redirect(CLIENT_URL);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export default router;
