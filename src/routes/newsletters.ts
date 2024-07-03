import express from 'express';
import * as NewsletterController from '../controllers/newsletterController';
import { verifyTokenAndAdmin } from './verifyToken';

const router = express.Router();

router.get('/', verifyTokenAndAdmin, NewsletterController.getNewsletters);
router.get('/:id', verifyTokenAndAdmin, NewsletterController.getNewsletter);
router.post('/', NewsletterController.createNewsletter);
router.put('/:id', verifyTokenAndAdmin, NewsletterController.updateNewsletter);
router.delete('/:id', verifyTokenAndAdmin, NewsletterController.deleteNewsletter);

export default router;
