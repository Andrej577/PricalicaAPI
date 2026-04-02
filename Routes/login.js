const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

// login funkcija
async function login(req, res) {
    const { email, lozinka } = req.body;

    try {
        const [rows] = await db.pool.query(
            'SELECT * FROM korisnici WHERE email = ? AND lozinka_hash = ?',
            [email, lozinka]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Neispravni podaci za prijavu' });
        }

        return res.status(200).json({
            message: 'Prijava uspjesna',
            korisnik_id: rows[0].korisnik_id,
            ime: rows[0].ime,
            prezime: rows[0].prezime,
            email: rows[0].email,
        });
    } catch (err) {
        console.error('Greska kod prijave:', err);
        res.status(500).json({ error: 'Greska na serveru' });
    }
}

// POST /login
router.post('/', login);

module.exports = router;
