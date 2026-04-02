const request = require('supertest');
const app = require('../index.js');
const { pool } = require('../Database/DB');

let autorId;
let knjigaId;

beforeAll(async () => {
    const unique = Date.now();

    const [autorResult] = await pool.query(
        `INSERT INTO korisnici
        (ime, prezime, email, lozinka_hash, tipKorisnika_id, statusRacuna_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            'Post',
            'Autor',
            `post.knjiga.autor.${unique}@example.com`,
            'test123',
            2,
            1,
        ]
    );

    autorId = autorResult.insertId;
});

test('POST /knjige', async () => {
    const unique = Date.now();

    const res = await request(app)
        .post('/knjige')
        .send({
            naslov: `Post knjiga ${unique}`,
            autor_id: autorId,
            zanr_id: 1,
            trajanje_min: 90,
            opis: 'Nova testna knjiga',
            statusDostupnosti_id: 1,
            poveznica: `post_knjiga_${unique}`,
            prosjecna_ocjena: 0,
        });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('knjiga_id');
    expect(res.body).toHaveProperty('naslov');

    knjigaId = res.body.knjiga_id;
});

afterAll(async () => {
    if (knjigaId) {
        await pool.query('DELETE FROM knjige WHERE knjiga_id = ?', [knjigaId]);
    }

    if (autorId) {
        await pool.query('DELETE FROM knjige WHERE autor_id = ?', [autorId]);
        await pool.query('DELETE FROM korisnici WHERE korisnik_id = ?', [autorId]);
    }

    await pool.end();
});
