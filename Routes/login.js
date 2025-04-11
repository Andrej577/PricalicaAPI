const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

router.get('/', async (req, res) => {
    try {
        const result = await db.pool.query('SELECT * FROM povijest_slusanja');
        res.json(result.rows);
    } catch (err) {
        console.error('Greška pri dohvaćanju povijesti slusanja:', err);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});




module.exports = router;