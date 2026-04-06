const request = require('supertest');
const app = require('../index.js');
const { pool } = require('../Database/DB');

describe('Ruta /login', () => {
    test('POST /login vraca korisnika za ispravne podatke', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: 'ivana.radic@example.com',
                lozinka: 'Ivana#Best9',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Prijava uspjesna');
        expect(res.body).toHaveProperty('korisnik_id');
    });

    test('POST /login vraca 401 za neispravne podatke', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: 'krivi@example.com',
                lozinka: 'krivo',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

});
