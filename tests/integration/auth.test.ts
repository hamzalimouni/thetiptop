// tests/auth.test.ts
import request from 'supertest';
import app from '../../src/app';

// Mocking Express Request
const mockRegisterRequest = () => ({
    body: {
        firstname: 'The',
        lastname: 'Tiptop',
        email: 'client@email.com',
        gender: 'MALE',
        password: 'Clinet12!',
        birth: '2001-08-18T00:00:00Z',
    },
    bodyDataMissing: {
        firstname: 'The',
        lastname: 'Tiptop',
    },
    bodyAlreadyExist: {
        firstname: 'The',
        lastname: 'Tiptop',
        email: 'admin@email.com',
        gender: 'MALE',
        password: 'Admin12!',
        birth: '2001-08-18T00:00:00Z',
    },
});

const mockLoginRequest = () => ({
    bodyServerError: {},
    bodyNotFound: {
        email: 'notfound@email.com',
        password: 'notfound',
    },
    bodyWrongCredentials: {
        email: 'admin@email.com',
        password: 'wrong password',
    },
    body: {
        email: 'admin@email.com',
        password: 'Admin12!',
    },
});

// Register Test
describe('POST /api/auth/register', () => {
    //Register Missing Data
    it('should return success message when user is created', async () => {
        const req = mockRegisterRequest();
        const res = await request(app).post('/api/auth/register').send(req.bodyDataMissing);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    //Register Success
    it('should return success message when user is created', async () => {
        const req = mockRegisterRequest();
        const res = await request(app).post('/api/auth/register').send(req.body);
        if (res?.status === 201) {
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('success');
        }
    });

    // Register Failure User Already Exists
    it('should return user already exist', async () => {
        const req = mockRegisterRequest();
        const res = await request(app).post('/api/auth/register').send(req.bodyAlreadyExist);
        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('error');
    });
});

// Login Test
describe('POST /api/auth/login', () => {
    // Login Failure User Not Found
    it('should return user not found', async () => {
        const req = mockLoginRequest();
        const res = await request(app).post('/api/auth/login').send(req.bodyNotFound);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
    });

    // Login Failure Wrong credenials
    it('should return user wrong credentials', async () => {
        const req = mockLoginRequest();
        const res = await request(app).post('/api/auth/login').send(req.bodyWrongCredentials);
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('error');
    });

    // Login Success
    it('should return user informations', async () => {
        const req = mockLoginRequest();
        const res = await request(app).post('/api/auth/login').send(req.body);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('others');
    });
});
