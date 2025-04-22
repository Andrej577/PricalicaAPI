const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM transakcije');
        res.json(rows);
    } catch (err) {
        console.error('Greška pri dohvaćanju transakcija:', err);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

router.delete('/:id', async (req, res) =>
{
    const transakcijaId = req.params.id;
    try
    {
        const [rows] = await db.pool.query("DELETE FROM transakcije WHERE transakcija_id = ?;", [transakcijaId]);
        if (rows.length === 0)
        {
            return res.status(404).json({ Odgovor: "Brisanje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Transakcija obrisana");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})

router.put('/:id', async (req, res) =>
{
    const transakcijaId = req.params.id;
    const status = req.body;
    try
    {
        const [rows] = await db.pool.query("UPDATE transakcije SET status = ? WHERE transakcija_id = ?;", [status, transakcijaId]);
        if (rows.length === 0)
        {
            return res.status(404).json({ Odgovor: "Ažuriranje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Transakcija je ažurirana");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})


module.exports = router;