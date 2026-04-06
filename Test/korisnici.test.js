jest.mock('../Database/DB', () => require('./helpers/mockDb'));

const request = require('supertest');
const app = require('../index.js');
const mockDb = require('./helpers/mockDb');

const { query, defaultConnection, resetAll } = mockDb.__mocks;

describe('Rute /korisnici', () => {
    beforeEach(() => {
        resetAll();
    });

    test('GET /korisnici vraca listu korisnika', async () => {
        query.mockResolvedValueOnce([
            [{ korisnik_id: 1, ime: 'Maja' }],
        ]);

        const res = await request(app).get('/korisnici');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ korisnik_id: 1, ime: 'Maja' }]);
        expect(query).toHaveBeenCalledWith('SELECT * FROM korisnici');
    });

    test('GET /korisnici/:id vraca 404 kada korisnik ne postoji', async () => {
        query.mockResolvedValueOnce([[]]);

        const res = await request(app).get('/korisnici/999');

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: 'Korisnik nije pronaden' });
    });

    test('POST /korisnici validira obavezna polja', async () => {
        const res = await request(app)
            .post('/korisnici')
            .send({ ime: 'Ana' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'Ime, prezime, email i lozinka su obavezni.' });
    });

    test('POST /korisnici kreira korisnika', async () => {
        query
            .mockResolvedValueOnce([{ insertId: 15 }])
            .mockResolvedValueOnce([[{ korisnik_id: 15, email: 'ana@example.com' }]]);

        const res = await request(app)
            .post('/korisnici')
            .send({
                ime: 'Ana',
                prezime: 'Marić',
                email: 'ana@example.com',
                lozinka: 'tajna',
                tipKorisnika: 3,
                statusRacuna: 1,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ korisnik_id: 15, email: 'ana@example.com' });
    });

    test('PUT /korisnici/:id azurira korisnika', async () => {
        query
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ korisnik_id: 7, ime: 'Novo', statusRacuna_id: 2 }]]);

        const res = await request(app)
            .put('/korisnici/7')
            .send({
                ime: 'Novo',
                prezime: 'Prezime',
                email: 'novo@example.com',
                lozinka: 'nova-lozinka',
                statusRacuna: 2,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ korisnik_id: 7, ime: 'Novo', statusRacuna_id: 2 });
    });

    test('DELETE /korisnici/:id brise korisnika kroz transakciju', async () => {
        defaultConnection.query
            .mockResolvedValueOnce([
                [
                    { TABLE_NAME: 'knjige', COLUMN_NAME: 'autor_id' },
                    { TABLE_NAME: 'interakcije', COLUMN_NAME: 'korisnik_id' },
                    { TABLE_NAME: 'interakcije', COLUMN_NAME: 'knjiga_id' },
                    { TABLE_NAME: 'povijest_slusanja', COLUMN_NAME: 'korisnik_id' },
                    { TABLE_NAME: 'povijest_slusanja', COLUMN_NAME: 'knjiga_id' },
                    { TABLE_NAME: 'analitika', COLUMN_NAME: 'knjiga_id' },
                    { TABLE_NAME: 'autori', COLUMN_NAME: 'autor_id' },
                ],
            ])
            .mockResolvedValueOnce([[{ korisnik_id: 3 }]])
            .mockResolvedValueOnce([[{ knjiga_id: 10 }, { knjiga_id: 11 }]])
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([{ affectedRows: 2 }])
            .mockResolvedValueOnce([{ affectedRows: 2 }])
            .mockResolvedValueOnce([{ affectedRows: 2 }])
            .mockResolvedValueOnce([{ affectedRows: 2 }])
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([{ affectedRows: 1 }]);

        const res = await request(app).delete('/korisnici/3');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('Korisnik obrisan');
        expect(defaultConnection.beginTransaction).toHaveBeenCalled();
        expect(defaultConnection.commit).toHaveBeenCalled();
        expect(defaultConnection.release).toHaveBeenCalled();
    });
});
