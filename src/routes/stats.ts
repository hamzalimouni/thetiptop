import express from 'express';
import * as statsController from '../controllers/statsController';
import { verifyTokenAndAdmin } from './verifyToken';

const router = express.Router();

router.get('/tickets', verifyTokenAndAdmin, statsController.getTicketsStats);
router.get('/top-participants', verifyTokenAndAdmin, statsController.getTopParticipants);
router.get('/newsletters', verifyTokenAndAdmin, statsController.getNewslettersInfo);
router.get('/profits', verifyTokenAndAdmin, statsController.getProfitsInfo);

export default router;
