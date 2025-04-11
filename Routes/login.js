const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

// login funkcija
async function login(req, res) {
    const { email, lozinka } = req.body;

    try {
        const result = await db.pool.query(
            'SELECT * FROM korisnici WHERE email = $1 AND lozinka_hash = $2',
            [email, lozinka]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ error: 'error' });
        }

        return res.status(200).json({ message: 'Prijava uspješna' });
    } catch (err) {
        console.error('Greška kod prijave:', err);
        res.status(500).json({ error: 'Greška na serveru' });
    }
}

// POST /login
router.post('/', login);

module.exports = router;
