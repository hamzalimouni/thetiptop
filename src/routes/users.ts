import express from 'express';
import * as UserController from '../controllers/userController';
import { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyTokenAndEmploye } from './verifyToken';

const router = express.Router();

router.get('/', verifyTokenAndAdmin, UserController.getUsers);
router.get('/employes', verifyTokenAndAdmin, UserController.getEmployes);
router.get('/winners', verifyTokenAndEmploye, UserController.getWinnersUsers);
router.get('/:id', verifyTokenAndAuthorization, UserController.getUser);
router.post('/', verifyTokenAndAdmin, UserController.postUser);
router.put('/:id', verifyTokenAndAuthorization, UserController.updateUser);
router.delete('/:id', verifyTokenAndAuthorization, UserController.deleteUser);

export default router;
