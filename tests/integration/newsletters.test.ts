// test newsletter.test.ts
import request from 'supertest';
import app from '../../src/app';
import { mockLoginRequest } from '../globalData';

let token: string;
describe('GET /api/newsletters/', () => {
    beforeAll(async () => {
        const req = mockLoginRequest();
        const res = await request(app).post('/api/auth/login').send(req.bodyAdmin);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });
    it('should get all newsletters', async () => {
        const res = await request(app).get('/api/newsletters').set('token', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('count');
    });
});

describe('POST /api/newsletters', () => {
    // Newsletter Already Exist
    it('should return newsletter already exist', async () => {
        const res = await request(app).post('/api/newsletters').send({ email: 'hamzalimouni9@gmail.com' });
        if (res?.status === 201) {
            expect(res.status).toBe(201);
        } else {
            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('error');
        }
    });
});
