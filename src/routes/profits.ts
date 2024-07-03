import express from 'express';
import * as ProfitController from '../controllers/profitController';
import { verifyTokenAndEmploye } from './verifyToken';

const router = express.Router();

router.get('/', verifyTokenAndEmploye, ProfitController.getProfits);
router.get('/:id', verifyTokenAndEmploye, ProfitController.getProfit);

export default router;
