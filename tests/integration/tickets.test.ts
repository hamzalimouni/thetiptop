// tests/tickets.test.ts
import request from 'supertest';
import app from '../../src/app';
import { mockLoginRequest } from '../globalData';

let token: string;
describe('GET /api/tickets/', () => {
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

// describe('GET /api/tickets/user/:userId', () => {
//     let token: string;

//     it('should login and get token', async () => {
//         const req = mockLoginRequest();
//         const res = await request(app).post('/api/auth/login').send(req.bodyUser);
//         expect(res.status).toBe(201);
//         expect(res.body).toHaveProperty('token');
//         token = res.body.token;
//     });

//     it('should get tickets by user', async () => {
//         const userId: number = 3;
//         const res = await request(app).get(`/api/tickets/user/${userId}`).set('token', `Bearer ${token}`);
//         expect(res.status).toBe(200);
//     });
// });

// describe('PUT /api/tickets/user/', () => {
//     let token: string;

//     it('should login and get token', async () => {
//         const req = mockLoginRequest();
//         const res = await request(app).post('/api/auth/login').send(req.bodyUser);
//         expect(res.status).toBe(201);
//         expect(res.body).toHaveProperty('token');
//         token = res.body.token;
//     });

//     it('should return ticket not found', async () => {
//         const id: number = 100;
//         const authorId: number = 3;
//         const res = await request(app).put('/api/tickets/user').send({ id, authorId }).set('token', `Bearer ${token}`);
//         expect(res.status).toBe(404);
//         expect(res.body).toHaveProperty('error', 'Ticket not found!');
//     });

//     it('should get updated ticket by user', async () => {
//         const id: number = 1;
//         const authorId: number = 3;
//         const res = await request(app).put('/api/tickets/user').send({ id, authorId }).set('token', `Bearer ${token}`);
//         expect(res.status).toBe(200);
//     });
// });

// describe('PUT /api/tickets/employe/', () => {
//     let token: string;

//     it('should login and get token ("ROLE_EMPLOYE")', async () => {
//         const req = mockLoginRequest();
//         const res = await request(app).post('/api/auth/login').send(req.bodyEmploye);
//         expect(res.status).toBe(201);
//         expect(res.body).toHaveProperty('token');
//         token = res.body.token;
//     });

//     it('should return ticket not found', async () => {
//         const id: number = 100;
//         const employeId: number = 2;
//         const res = await request(app).put('/api/tickets/employe').send({ id, employeId }).set('token', `Bearer ${token}`);
//         expect(res.status).toBe(404);
//         expect(res.body).toHaveProperty('error', 'Ticket not found!');
//     });

//     it('should get updated ticket by employe', async () => {
//         const id: number = 1;
//         const employeId: number = 2;
//         const res = await request(app).put('/api/tickets/employe').send({ id, employeId }).set('token', `Bearer ${token}`);
//         expect(res.status).toBe(200);
//     });
// });
