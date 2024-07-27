// tests/blogs.test.ts
import request from 'supertest';
import app from '../../src/app';
import prisma from '../../prisma/db';
import { mockLoginRequest } from '../globalData';

let token: string;
describe('/api/blogs', () => {
    beforeAll(async () => {
        const req = mockLoginRequest();
        const res = await request(app).post('/api/auth/login').send(req.bodyAdmin);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should get blogs with default pagination', async () => {
        const response = await request(app).get('/api/blogs');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('count');
    });

    it('should get blogs with custom pagination', async () => {
        const response = await request(app).get('/api/blogs').query({ page: 2 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('count');
    });

    it('should create a new blog', async () => {
        const newBlog = {
            title: 'Test Blog',
            desc: 'This is a test blog',
            img: 'test.jpg',
            status: true,
        };
        const response = await request(app).post('/api/blogs').send(newBlog).set('token', `Bearer ${token}`);
        expect(response.status).toBe(201);
    });

    it('should return an error for invalid blog data', async () => {
        const invalidBlog = {
            title: 'Invalid Blog',
        };

        const response = await request(app).post('/api/blogs').send(invalidBlog).set('token', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    afterAll(async () => {
        await prisma.blog.deleteMany({ where: {} });
        await prisma.$executeRaw`ALTER TABLE Blog AUTO_INCREMENT = 1;`;
    });
});
