jest.mock('../Database/DB', () => require('./helpers/mockDb'));

const request = require('supertest');
const app = require('../index.js');
const mockDb = require('./helpers/mockDb');

const { query, resetAll } = mockDb.__mocks;

describe('Ostale API rute', () => {
    beforeEach(() => {
        resetAll();
    });

    test('GET / vraca osnovnu poruku API-ja', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Api main');
    });

    test('GET /analitika vraca listu analitike', async () => {
        query.mockResolvedValueOnce([
            [{ analitika_id: 1, broj_slusanja: 10 }],
        ]);

        const res = await request(app).get('/analitika');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ analitika_id: 1, broj_slusanja: 10 }]);
    });

    test('GET /povijest_slusanja vraca listu povijesti', async () => {
        query.mockResolvedValueOnce([
            [{ povijest_id: 1, pozicija: 120 }],
        ]);

        const res = await request(app).get('/povijest_slusanja');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ povijest_id: 1, pozicija: 120 }]);
    });

    test('GET /zanrovi vraca listu zanrova', async () => {
        query.mockResolvedValueOnce([
            [{ zanr_id: 1, naziv: 'Fantastika' }],
        ]);

        const res = await request(app).get('/zanrovi');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ zanr_id: 1, naziv: 'Fantastika' }]);
    });
});
