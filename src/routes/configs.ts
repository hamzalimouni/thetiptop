import express from 'express';
import * as ConfigController from '../controllers/configController';

const router = express.Router();

router.get('/', ConfigController.getConfig);

export default router;
