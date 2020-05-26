import request  from 'supertest';
// @ts-ignore
import { initServer } from '../src/app';
import HttpStatus from 'http-status-codes'
import { Server } from 'http';
// @ts-ignore
import { User } from '../src/models/user-model';
let agent: ReturnType<typeof request.agent>;
let server: Server;

let outUser: User;

describe('Test generation', () => {
    it('Should generate user with username and without password', async () => {
        const response = await agent.get('/api/users/generate');
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toHaveProperty('email');
        expect(response.body).not.toHaveProperty('password');
        outUser = response.body;
    });
});

describe('Test fail unchanged password', () => {
    it('Should fail login', async () => {
        const response = await agent.post('/api/users/login').send({
            email: outUser.email,
            password: '123qwe',
        });
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        outUser.password = '123qwe';
    });
});

describe('Test password update', () => {
    it('Should change password with status 200', async () => {
        const newPassword = '123qwe';
        const response = await agent.put(`/api/users/${outUser._id}`).send({
            password: newPassword,
        });
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe('Test login', () => {
    it('Should fail login with incorrect password', async () => {
        const response = await agent.post('/api/users/login').send({
            email: outUser.email,
            password: '123456789',
        });
        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
    it('Should login', async () => {
        console.log(outUser.password);
        const response = await agent.post('/api/users/login').send({
            email: outUser.email,
            password: outUser.password,
        });
        expect(response.status).toBe(HttpStatus.OK);
    });
});

beforeAll(async () => {
    server = await initServer();
    agent = request.agent(server);
});

afterAll(() => {
    server.close();
});
