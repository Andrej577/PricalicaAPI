const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM korisnici');
        res.json(rows);
    } catch (err) {
        console.error('Greska pri dohvacanju korisnika:', err);
        res.status(500).json({ error: 'Greska na serveru' });
    }
});

router.get('/:id', async (req, res) => {
    const korisnikId = req.params.id;

    try {
        const [rows] = await db.pool.query('SELECT * FROM korisnici WHERE korisnik_id = ?;', [korisnikId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Korisnik nije pronaden' });
        }

        return res.json(rows[0]);
    } catch (err) {
        console.error('Greska pri dohvacanju korisnika po ID-u:', err);
        return res.status(500).json({ error: 'Greska na serveru' });
    }
});

router.put('/:id', async (req, res) => {
    const korisnikId = req.params.id;
    const {
        ime,
        prezime,
        email,
        lozinka,
        statusRacuna,
        aktivan,
    } = req.body;

    const statusRacunaId = aktivan === false ? 2 : Number(statusRacuna ?? 1);

    try {
        const [result] = await db.pool.query(
            `UPDATE korisnici
             SET ime = ?, prezime = ?, email = ?, lozinka_hash = ?, statusRacuna_id = ?
             WHERE korisnik_id = ?;`,
            [
                ime,
                prezime,
                email,
                lozinka,
                statusRacunaId,
                korisnikId,
            ],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ odgovor: 'Azuriranje nije uspjelo' });
        }

        const [rows] = await db.pool.query('SELECT * FROM korisnici WHERE korisnik_id = ?;', [
            korisnikId,
        ]);

        return res.status(200).json(rows[0]);
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    const korisnikId = req.params.id;

    try {
        const [result] = await db.pool.query('DELETE FROM korisnici WHERE korisnik_id = ?;', [korisnikId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ odgovor: 'Brisanje nije uspjelo' });
        }

        return res.status(200).json('Korisnik obrisan');
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
