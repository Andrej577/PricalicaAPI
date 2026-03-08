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
            'Delete',
            'Korisnik',
            `delete.korisnik.${unique}@example.com`,
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
            'Delete',
            'Autor',
            `delete.autor.${unique}@example.com`,
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
            'Delete knjiga',
            autorId,
            1,
            120,
            'Opis testne knjige',
            1,
            'delete_knjiga',
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

test('DELETE /interakcije/:id', async () => {
    const res = await request(app).delete(`/interakcije/${interakcijaId}`);

    expect(res.statusCode).toBe(200);

    const [rows] = await pool.query(
        'SELECT * FROM interakcije WHERE interakcija_id = ?',
        [interakcijaId]
    );

    expect(rows.length).toBe(0);
});

test('DELETE /transakcije/:id', async () => {
    const res = await request(app).delete(`/transakcije/${transakcijaId}`);

    expect(res.statusCode).toBe(200);

    const [rows] = await pool.query(
        'SELECT * FROM transakcije WHERE transakcija_id = ?',
        [transakcijaId]
    );

    expect(rows.length).toBe(0);
});

test('DELETE /knjige/:id', async () => {
    const res = await request(app).delete(`/knjige/${knjigaId}`);

    expect(res.statusCode).toBe(200);

    const [rows] = await pool.query(
        'SELECT * FROM knjige WHERE knjiga_id = ?',
        [knjigaId]
    );

    expect(rows.length).toBe(0);
});

test('DELETE /korisnici/:id', async () => {
    const res = await request(app).delete(`/korisnici/${korisnikId}`);

    expect(res.statusCode).toBe(200);

    const [rows] = await pool.query(
        'SELECT * FROM korisnici WHERE korisnik_id = ?',
        [korisnikId]
    );

    expect(rows.length).toBe(0);
});

afterAll(async () => {
    try {
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
            await pool.query('DELETE FROM knjige WHERE autor_id = ?', [autorId]);
            await pool.query('DELETE FROM autori WHERE autor_id = ?', [autorId]);
            await pool.query('DELETE FROM korisnici WHERE korisnik_id = ?', [autorId]);
        }
    } catch (err) {
        console.error(err);
    }

    await pool.end();
});