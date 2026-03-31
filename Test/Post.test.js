const request = require('supertest');
const app = require('../index.js');
const { pool } = require('../Database/DB');

let korisnikId;

test('POST /korisnici', async () => {
    const unique = Date.now();

    const res = await request(app)
        .post('/korisnici')
        .send({
            ime: 'Post',
            prezime: 'Korisnik',
            email: `post.korisnik.${unique}@example.com`,
            lozinka: 'test123',
            tipKorisnika: 3,
            statusRacuna: 1,
        });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('korisnik_id');
    expect(res.body).toHaveProperty('email');

    korisnikId = res.body.korisnik_id;
});

afterAll(async () => {
    if (korisnikId) {
        await pool.query('DELETE FROM korisnici WHERE korisnik_id = ?', [korisnikId]);
    }

    await pool.end();
});
