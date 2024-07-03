import express from 'express';
import * as BlogController from '../controllers/blogController';
import { verifyTokenAndAdmin } from './verifyToken';

const router = express.Router();

router.get('/', BlogController.getBlogs);
router.get('/last-three', BlogController.getLastThreeBlog);
router.get('/:id', BlogController.getBlog);
router.post('/', verifyTokenAndAdmin, BlogController.createBlog);
router.put('/:id', verifyTokenAndAdmin, BlogController.updateBlog);
router.delete('/:id', verifyTokenAndAdmin, BlogController.deleteBlog);

export default router;
