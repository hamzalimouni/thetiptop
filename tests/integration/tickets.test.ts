// tests/tickets.test.ts
import request from 'supertest';
import app from '../../src/app';
import { mockLoginRequest } from '../globalData';

let token: string;
describe('GET /api/tickets/', () => {
    // get Access token before request
    beforeAll(async () => {
        const req = mockLoginRequest();
        const res = await request(app).post('/api/auth/login').send(req.bodyAdmin);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should get all tickets', async () => {
        const res = await request(app).get('/api/tickets').set('token', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    // Test With Not Exist ID
    it('should return ticket not found', async () => {
        const code: string = 'NotFound';
        const res = await request(app).get(`/api/tickets/${code}`).set('token', `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Ticket not found!');
    });

    // Test With Exist ID
    it('should get tickets', async () => {
        const code: string = 'F35532F60D';
        const res = await request(app).get(`/api/tickets/${code}`).set('token', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
});
