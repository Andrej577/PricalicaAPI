const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM korisnici');
        res.json(rows);
    } catch (err) {
        console.error('Greška pri dohvaćanju korisnika:', err);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

router.delete('/:id', async (req, res) =>
{
    const korisnikId = req.params.id;
    try
    {
        // za serializaciju se koristi $ znak a ne ?
        // Ovo ce realno bacit constraint ako postoji bilo kakva interakcija ili povijest slusanja
        const [rows] = await db.pool.query("DELETE FROM korisnici WHERE korisnik_id = ?;", [korisnikId]);
        if (rows.length === 0)
        {
            return res.status(404).json({ Odgovor: "Brisanje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Korisnik obrisan");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})

router.put('/:id', async (req, res) =>
{
    const korisnikId = req.params.id;
    const ime = req.body;
    try
    {
        const [rows] = await db.pool.query("UPDATE korisnici SET ime = ? WHERE korisnik_id = ?;", [naslov, korisnikId]);
        if (rows.length === 0)
        {
            return res.status(404).json({ Odgovor: "Ažuriranje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Korisnik je ažuriran");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})

module.exports = router;