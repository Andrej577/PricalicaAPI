const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM povijest_slusanja');
        res.json(rows);
    } catch (err) {
        console.error('Greška pri dohvaćanju povijesti slusanja:', err);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

router.delete('/:id', async (req, res) =>
{
    const povijestId = req.params.id;
    try
    {
        // Ovo ce realno bacit constraint ako postoji bilo kakva interakcija ili povijest slusanja
        const [rows] = await db.pool.query("DELETE FROM povijest_slusanja WHERE povijest_id = ?;", [povijestId]);
        if (rows.length === 0)
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
    const povijestId = req.params.id;
    const pozicijia = req.body;
    try
    {
        // Ovo ce realno bacit constraint ako postoji bilo kakva interakcija ili povijest slusanja
        const [rows] = await db.pool.query("UPDATE povijest_slusanja SET pozicija = ? WHERE povijest_id = ?;", [pozicijia, povijestId]);
        if (rows.length === 0)
        {
            return res.status(404).json({ Odgovor: "Ažuriranje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Povijest slusanja je ažurirana");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})


module.exports = router;