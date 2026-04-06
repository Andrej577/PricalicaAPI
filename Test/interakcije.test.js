jest.mock('../Database/DB', () => require('./helpers/mockDb'));

const request = require('supertest');
const app = require('../index.js');
const mockDb = require('./helpers/mockDb');

const { query, resetAll } = mockDb.__mocks;

describe('Rute /interakcije', () => {
    beforeEach(() => {
        resetAll();
    });

    test('GET /interakcije vraca listu interakcija', async () => {
        query.mockResolvedValueOnce([
            [{ interakcija_id: 1, ocjena: 5 }],
        ]);

        const res = await request(app).get('/interakcije');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ interakcija_id: 1, ocjena: 5 }]);
    });

    test('GET /interakcije/knjiga/:knjigaId vraca recenzije za knjigu', async () => {
        query.mockResolvedValueOnce([
            [{ id: 2, ime: 'Sara', prezime: 'Jurić', ocjena: 4 }],
        ]);

        const res = await request(app).get('/interakcije/knjiga/3');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ id: 2, ime: 'Sara', prezime: 'Jurić', ocjena: 4 }]);
    });

    test('POST /interakcije validira korisnika i knjigu', async () => {
        const res = await request(app).post('/interakcije').send({ ocjena: 5 });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'Korisnik i knjiga su obavezni.' });
    });

    test('POST /interakcije kreira interakciju', async () => {
        query
            .mockResolvedValueOnce([{ insertId: 12 }])
            .mockResolvedValueOnce([[{ interakcija_id: 12, recenzija: 'Odlično' }]]);

        const res = await request(app)
            .post('/interakcije')
            .send({
                korisnik_id: 5,
                knjiga_id: 8,
                ocjena: 5,
                recenzija: 'Odlično',
                omiljena: true,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ interakcija_id: 12, recenzija: 'Odlično' });
    });

    test('PUT /interakcije/:id azurira interakciju', async () => {
        query
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ interakcija_id: 7, ocjena: 4 }]]);

        const res = await request(app)
            .put('/interakcije/7')
            .send({
                korisnik_id: 5,
                knjiga_id: 8,
                ocjena: 4,
                recenzija: 'Vrlo dobro',
                omiljena: false,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ interakcija_id: 7, ocjena: 4 });
    });

    test('DELETE /interakcije/:id brise interakciju', async () => {
        query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const res = await request(app).delete('/interakcije/7');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('Interakcija obrisana');
    });
});
