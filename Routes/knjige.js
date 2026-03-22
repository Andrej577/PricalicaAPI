const express = require('express');
const router = express.Router();
const db = require('../Database/DB');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM knjige');
        res.json(rows);
    } catch (err) {
        console.error('Greška pri dohvaćanju knjige:', err);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

router.get('/:id', async (req, res) => {
    const knjigaId = req.params.id;

    try {
        const [rows] = await db.pool.query(`
            SELECT 
                k.naslov, 
                CONCAT(a.ime, ' ', a.prezime) AS autor, 
                z.nazivZanra AS zanr,
                k.opis
            FROM knjige k
            INNER JOIN korisnici a ON a.korisnik_id = k.autor_id
            INNER JOIN zanrovi z ON z.zanr_id = k.zanr_id
            WHERE k.knjiga_id = ?;
        `, [knjigaId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Knjiga nije pronađena' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Greška pri dohvaćanju knjige:', err);
        res.status(500).json({ error: 'Greška na serveru' });
    }
});

router.delete('/:id', async (req, res) =>
{
    const knjigaId = req.params.id;
    try
    {
        const [rows] = await db.pool.query("DELETE FROM knjige WHERE knjiga_id = ?;", [knjigaId]);
        if (rows.length === 0)
        {
            return res.status(404).json({ Odgovor: "Brisanje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Knjiga obrisana");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})

router.put('/:id', async (req, res) =>
{
    const knjigaId = req.params.id;
    const { naslov } = req.body;
    try
    {
        const [rows] = await db.pool.query("UPDATE knjige SET naslov = ? WHERE knjiga_id = ?;", [naslov, knjigaId]);
        if (rows.length === 0)
        {
            return res.status(404).json({ Odgovor: "Ažuriranje nije uspjelo"});
        }
        else
        {
            return res.status(200).json("Knjiga je ažurirana");
        }
    }
    catch(err)
    {
        return res.status(500).json(err);
    }
})


module.exports = router;