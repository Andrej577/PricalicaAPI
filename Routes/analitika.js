const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

router.get('/', async (req, res) => {
    try {
        const result = await db.pool.query('SELECT * FROM analitika');
        res.json(result.rows);
    } catch (err) {
        console.error('Greška pri dohvaćanju analitike:', err);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

router.delete('/:id', async (req, res) =>
{
    const analitikaId = req.params.id;
    try
    {
        // za serializaciju se koristi $ znak a ne ?
        // Ovo ce realno bacit constraint ako postoji bilo kakva interakcija ili povijest slusanja
        const result = await db.pool.query("DELETE FROM analitika WHERE analitika_id = $1;", [analitikaId]);
        if (result.rowCount == 0)
        {
            return res.status(404).json({ Odgovor: "Brisanje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Analitika obrisana");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})

router.put('/:id', async (req, res) =>
{
    const analitikaId = req.params.id;
    const brojslusanja = req.body;
    try
    {
        // za serializaciju se koristi $ znak a ne ?
        // Ovo ce realno bacit constraint ako postoji bilo kakva interakcija ili povijest slusanja
        const result = await db.pool.query("UPDATE analitika SET broj_slusanja = $1 WHERE analitika_id = $2;", [brojslusanja, analitikaId]);
        if (result.rowCount == 0)
        {
            return res.status(404).json({ Odgovor: "Ažuriranje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Analitika je ažurirana");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})


module.exports = router;