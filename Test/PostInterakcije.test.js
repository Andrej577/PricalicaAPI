const request = require('supertest');
const app = require('../index.js');
const { pool } = require('../Database/DB');

let korisnikId;
let autorId;
let knjigaId;
let interakcijaId;

beforeAll(async () => {
    const unique = Date.now();

    const [korisnikResult] = await pool.query(
        `INSERT INTO korisnici
        (ime, prezime, email, lozinka_hash, tipKorisnika_id, statusRacuna_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            'Post',
            'Korisnik',
            `post.interakcija.korisnik.${unique}@example.com`,
            'test123',
            3,
            1,
        ]
    );
    korisnikId = korisnikResult.insertId;

    const [autorResult] = await pool.query(
        `INSERT INTO korisnici
        (ime, prezime, email, lozinka_hash, tipKorisnika_id, statusRacuna_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            'Post',
            'Autor',
            `post.interakcija.autor.${unique}@example.com`,
            'test123',
            2,
            1,
        ]
    );
    autorId = autorResult.insertId;

    const [knjigaResult] = await pool.query(
        `INSERT INTO knjige
        (naslov, autor_id, zanr_id, trajanje_min, opis, statusDostupnosti_id, poveznica, prosjecna_ocjena)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            `Post interakcija knjiga ${unique}`,
            autorId,
            1,
            60,
            'Test knjiga',
            1,
            `post_interakcija_knjiga_${unique}`,
            0,
        ]
    );
    knjigaId = knjigaResult.insertId;
});

test('POST /interakcije', async () => {
    const res = await request(app)
        .post('/interakcije')
        .send({
            korisnik_id: korisnikId,
            knjiga_id: knjigaId,
            ocjena: 5,
            recenzija: 'Nova admin recenzija',
            omiljena: false,
        });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('interakcija_id');
    expect(res.body).toHaveProperty('recenzija');

    interakcijaId = res.body.interakcija_id;
});

afterAll(async () => {
    if (interakcijaId) {
        await pool.query('DELETE FROM interakcije WHERE interakcija_id = ?', [interakcijaId]);
    }

    if (knjigaId) {
        await pool.query('DELETE FROM knjige WHERE knjiga_id = ?', [knjigaId]);
    }

    if (korisnikId) {
        await pool.query('DELETE FROM korisnici WHERE korisnik_id = ?', [korisnikId]);
    }

    if (autorId) {
        await pool.query('DELETE FROM knjige WHERE autor_id = ?', [autorId]);
        await pool.query('DELETE FROM korisnici WHERE korisnik_id = ?', [autorId]);
    }

    await pool.end();
});
