jest.mock('../Database/DB', () => require('./helpers/mockDb'));

const request = require('supertest');
const app = require('../index.js');
const mockDb = require('./helpers/mockDb');

const { query, resetAll } = mockDb.__mocks;

describe('Ruta /login', () => {
    beforeEach(() => {
        resetAll();
    });

    test('POST /login vraca korisnika za ispravne podatke', async () => {
        query.mockResolvedValueOnce([
            [{ korisnik_id: 5, ime: 'Luka', prezime: 'Babić', email: 'luka@example.com' }],
        ]);

        const res = await request(app)
            .post('/login')
            .send({
                email: 'luka@example.com',
                lozinka: 'tajna',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: 'Prijava uspjesna',
            korisnik_id: 5,
            ime: 'Luka',
            prezime: 'Babić',
            email: 'luka@example.com',
        });
    });

    test('POST /login vraca 401 za neispravne podatke', async () => {
        query.mockResolvedValueOnce([[]]);

        const res = await request(app)
            .post('/login')
            .send({
                email: 'krivi@example.com',
                lozinka: 'krivo',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ error: 'Neispravni podaci za prijavu' });
    });
});
