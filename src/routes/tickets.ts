import express from 'express';
import * as TicketController from '../controllers/ticketController';
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyTokenAndEmploye } from './verifyToken';

const router = express.Router();

router.get('/', verifyTokenAndAdmin, TicketController.getTickets);
router.get('/random', verifyTokenAndEmploye, TicketController.getRandomTicket);
router.get('/:code', verifyToken, TicketController.getTicket);
router.get('/used/:code', TicketController.getUsedTicket);
router.get('/user/:id', verifyTokenAndAuthorization, TicketController.getUserTickets);
router.put('/user', verifyToken, TicketController.userUpdateTicket);
router.put('/employe', verifyTokenAndEmploye, TicketController.employeUpdateTicket);
router.put('/print/:id', verifyTokenAndEmploye, TicketController.printTicket);
router.post('/tirage', verifyTokenAndAdmin, TicketController.sendEmail);

export default router;
