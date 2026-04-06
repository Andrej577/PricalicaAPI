jest.mock('../Database/DB', () => require('./helpers/mockDb'));

const request = require('supertest');
const app = require('../index.js');
const mockDb = require('./helpers/mockDb');

const { query, resetAll } = mockDb.__mocks;

describe('Rute /knjige', () => {
    beforeEach(() => {
        resetAll();
    });

    test('GET /knjige vraca listu knjiga', async () => {
        query.mockResolvedValueOnce([
            [{ knjiga_id: 1, naslov: 'Ponoćni vlak' }],
        ]);

        const res = await request(app).get('/knjige');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ knjiga_id: 1, naslov: 'Ponoćni vlak' }]);
    });

    test('GET /knjige/:id vraca detalje knjige', async () => {
        query.mockResolvedValueOnce([
            [{ naslov: 'Ponoćni vlak', autor: 'Ivan Horvat', zanr: 'Fantastika' }],
        ]);

        const res = await request(app).get('/knjige/1');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            naslov: 'Ponoćni vlak',
            autor: 'Ivan Horvat',
            zanr: 'Fantastika',
        });
    });

    test('POST /knjige validira obavezna polja', async () => {
        const res = await request(app).post('/knjige').send({ naslov: 'Bez autora' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'Naslov, autor i zanr su obavezni.' });
    });

    test('POST /knjige kreira knjigu', async () => {
        query
            .mockResolvedValueOnce([{ insertId: 8 }])
            .mockResolvedValueOnce([[{ knjiga_id: 8, naslov: 'Nova knjiga' }]]);

        const res = await request(app)
            .post('/knjige')
            .send({
                naslov: 'Nova knjiga',
                autor_id: 2,
                zanr_id: 1,
                trajanje_min: 90,
                opis: 'Opis',
                statusDostupnosti_id: 1,
                poveznica: 'nova_knjiga',
                prosjecna_ocjena: 0,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ knjiga_id: 8, naslov: 'Nova knjiga' });
    });

    test('PUT /knjige/:id azurira knjigu', async () => {
        query
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ knjiga_id: 4, naslov: 'Ažurirana knjiga' }]]);

        const res = await request(app)
            .put('/knjige/4')
            .send({
                naslov: 'Ažurirana knjiga',
                autor_id: 2,
                zanr_id: 1,
                trajanje_min: 110,
                opis: 'Novi opis',
                statusDostupnosti_id: 1,
                poveznica: 'azurirana_knjiga',
                prosjecna_ocjena: 4.5,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ knjiga_id: 4, naslov: 'Ažurirana knjiga' });
    });

    test('DELETE /knjige/:id brise knjigu', async () => {
        query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const res = await request(app).delete('/knjige/4');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('Knjiga obrisana');
    });
});
