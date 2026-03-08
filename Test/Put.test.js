const request = require('supertest');
const app = require('../index.js');
const { pool } = require('../Database/DB');

let korisnikId;
let autorId;
let knjigaId;
let interakcijaId;
let transakcijaId;

beforeAll(async () => {
    const unique = Date.now();

    const [korisnikResult] = await pool.query(
        `INSERT INTO korisnici
        (ime, prezime, email, lozinka_hash, tipKorisnika_id, statusRacuna_id, ima_pretplatu)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            'Test',
            'Korisnik',
            `put.korisnik.${unique}@example.com`,
            'test123',
            3,
            1,
            false
        ]
    );
    korisnikId = korisnikResult.insertId;

    const [autorResult] = await pool.query(
        `INSERT INTO korisnici
        (ime, prezime, email, lozinka_hash, tipKorisnika_id, statusRacuna_id, ima_pretplatu)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            'Test',
            'Autor',
            `put.autor.${unique}@example.com`,
            'test123',
            2,
            1,
            false
        ]
    );
    autorId = autorResult.insertId;

    const [knjigaResult] = await pool.query(
        `INSERT INTO knjige
        (naslov, autor_id, zanr_id, trajanje_min, opis, statusDostupnosti_id, poveznica, prosjecna_ocjena)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            'Test knjiga',
            autorId,
            1,
            120,
            'Opis testne knjige',
            1,
            'test_knjiga',
            0.00
        ]
    );
    knjigaId = knjigaResult.insertId;

    const [interakcijaResult] = await pool.query(
        `INSERT INTO interakcije
        (korisnik_id, knjiga_id, ocjena, recenzija, omiljena)
        VALUES (?, ?, ?, ?, ?)`,
        [
            korisnikId,
            knjigaId,
            4,
            'Test recenzija',
            false
        ]
    );
    interakcijaId = interakcijaResult.insertId;

    const [transakcijaResult] = await pool.query(
        `INSERT INTO transakcije
        (korisnik_id, iznos, statusTransakcije_id)
        VALUES (?, ?, ?)`,
        [
            korisnikId,
            9.99,
            2
        ]
    );
    transakcijaId = transakcijaResult.insertId;
});

test('PUT /korisnici/:id', async () => {
    const res = await request(app)
        .put(`/korisnici/${korisnikId}`)
        .send({ ime: 'NovoIme' });

    expect(res.statusCode).toBe(200);

    const [rows] = await pool.query(
        'SELECT ime FROM korisnici WHERE korisnik_id = ?',
        [korisnikId]
    );

    expect(rows[0].ime).toBe('NovoIme');
});

test('PUT /knjige/:id', async () => {
    const res = await request(app)
        .put(`/knjige/${knjigaId}`)
        .send({ naslov: 'Novi naslov knjige' });

    expect(res.statusCode).toBe(200);

    const [rows] = await pool.query(
        'SELECT naslov FROM knjige WHERE knjiga_id = ?',
        [knjigaId]
    );

    expect(rows[0].naslov).toBe('Novi naslov knjige');
});

test('PUT /interakcije/:id', async () => {
    const res = await request(app)
        .put(`/interakcije/${interakcijaId}`)
        .send({ ocjena: 5 });

    expect(res.statusCode).toBe(200);

    const [rows] = await pool.query(
        'SELECT ocjena FROM interakcije WHERE interakcija_id = ?',
        [interakcijaId]
    );

    expect(rows[0].ocjena).toBe(5);
});

test('PUT /transakcije/:id', async () => {
    const res = await request(app)
        .put(`/transakcije/${transakcijaId}`)
        .send({ statusTransakcije_id: 1 });

    expect(res.statusCode).toBe(200);

    const [rows] = await pool.query(
        'SELECT statusTransakcije_id FROM transakcije WHERE transakcija_id = ?',
        [transakcijaId]
    );

    expect(rows[0].statusTransakcije_id).toBe(1);
});

afterAll(async () => {
    if (interakcijaId) {
        await pool.query('DELETE FROM interakcije WHERE interakcija_id = ?', [interakcijaId]);
    }

    if (transakcijaId) {
        await pool.query('DELETE FROM transakcije WHERE transakcija_id = ?', [transakcijaId]);
    }

    if (knjigaId) {
        await pool.query('DELETE FROM knjige WHERE knjiga_id = ?', [knjigaId]);
    }

    if (korisnikId) {
        await pool.query('DELETE FROM korisnici WHERE korisnik_id = ?', [korisnikId]);
    }

    if (autorId) {
        await pool.query('DELETE FROM autori WHERE autor_id = ?', [autorId]);
        await pool.query('DELETE FROM korisnici WHERE korisnik_id = ?', [autorId]);
    }

    await pool.end();
});