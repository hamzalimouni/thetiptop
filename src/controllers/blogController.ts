import { Request, Response } from 'express';
import prisma from '../../prisma/db';
import { Blog } from '@prisma/client';
import Joi from 'joi';

const blogSchema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    img: Joi.string().allow(null).optional(),
    status: Joi.boolean().optional(),
});

export const getBlogs = async (req: Request, res: Response) => {
    const page: number = Number(req.query.page as string);
    const pageSize: number = 9;
    const skip: number = (page - 1) * pageSize;
    try {
        let blogsQuery: { skip?: number; take?: number } = {
            skip,
            take: pageSize,
        };
        if (!req.query.page) {
            blogsQuery = {};
        }
        const blogs: Blog[] = await prisma.blog.findMany(blogsQuery);
        const count: number = await prisma.blog.count();
        return res.status(200).json({ data: blogs, count });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLastThreeBlog = async (req: Request, res: Response) => {
    try {
        const blogs: Blog[] = await prisma.blog.findMany({
            orderBy: {
                id: 'desc',
            },
            take: 3,
        });
        return res.status(200).json(blogs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getBlog = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    try {
        const existingBlog = await prisma.blog.findUnique({
            where: { id },
        });

        if (!existingBlog) return res.status(404).json({ error: 'blog not found!' });

        const blog: Blog | null = await prisma.blog.findUnique({
            where: { id },
        });
        return res.status(200).json(blog);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createBlog = async (req: Request, res: Response) => {
    const data: Blog = req.body;
    const { error } = blogSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        await prisma.blog.create({
            data,
        });
        return res.status(201).json('Blog has been inserted');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateBlog = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const data: Blog = req.body;
    const { error } = blogSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const existingBlog = await prisma.blog.findUnique({
            where: { id },
        });
        if (!existingBlog) return res.status(404).json({ error: 'blog not found' });

        await prisma.blog.update({
            where: { id },
            data,
        });
        return res.status(201).json('Blog has been updated');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteBlog = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    try {
        const existingBlog = await prisma.blog.findUnique({
            where: { id },
        });

        if (!existingBlog) return res.status(404).json({ error: 'blog not found' });

        await prisma.blog.delete({
            where: { id },
        });
        return res.status(204).json('Blog has been deleted');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
