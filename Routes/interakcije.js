const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

router.get('/', async (req, res) => {
    try {
        const result = await db.pool.query('SELECT * FROM interakcije');
        res.json(result.rows);
    } catch (err) {
        console.error('Greška pri dohvaćanju interakcije:', err);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

router.delete('/:id', async (req, res) =>
{
    const interakcijaId = req.params.id;
    try
    {
        // za serializaciju se koristi $ znak a ne ?
        // Ovo ce realno bacit constraint ako postoji bilo kakva interakcija ili povijest slusanja
        const result = await db.pool.query("DELETE FROM interakcije WHERE interakcija_id = $1;", [interakcijaId]);
        if (result.rowCount == 0)
        {
            return res.status(404).json({ Odgovor: "Brisanje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Interakcija obrisana");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})

router.put('/:id', async (req, res) =>
{
    const interakcijaId = req.params.id;
    const ocjena = req.body;
    try
    {
        // za serializaciju se koristi $ znak a ne ?
        // Ovo ce realno bacit constraint ako postoji bilo kakva interakcija ili povijest slusanja
        const result = await db.pool.query("UPDATE interakcije SET ocjena = $1 WHERE interakcija_id = $2;", [naslov, interakcijaId]);
        if (result.rowCount == 0)
        {
            return res.status(404).json({ Odgovor: "Ažuriranje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Interakcija je ažurirana");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})

module.exports = router;