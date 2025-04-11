const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { testConnection } = require('./Database/DB');

const korisniciRoutes = require('./Routes/korisnici');
const knjigeRoutes = require('./Routes/knjige');
const transakcijeRoutes = require('./Routes/transakcije');
const interakcijeRoutes = require('./Routes/interakcije');
const analitikaRoutes = require('./Routes/analitika');
const povijestRoutes = require('./Routes/povijestSlusanja');

testConnection();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Pozdrav iz Node.js aplikacije');
});

app.use('/korisnici', korisniciRoutes);
app.use("/knjige", knjigeRoutes);
app.use("/transakcije", transakcijeRoutes);
app.use("/interakcije", interakcijeRoutes);
app.use("/analitika", analitikaRoutes);
app.use("/povijest_slusanja", povijestRoutes);

// huh...ovo mora biti ovako inace Jest(test framework) poludi jer ne moze zatvoriti handle-ove
// sta to znaci?
// ovaj index.js se exportira kao modul u komponentu testova i ostavlja za sobom otvoren app.listen
// i onda Jest pocne zezat jer je u importiranom modulu ostao handle (app.listen event) otvoren
// jer se Jest ne moze vratiti u index.js i zatvorit handle posto ga on nije niti otvorio (njega otvara core/main)
// teoretski app.listen se moze i maknut al nije rjesenje jer necemo svaki event micat iz modula zbog glupih testova
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    testConnection();
    app.listen(PORT, () => {
        console.log(`Server radi na http://localhost:${PORT}`);
    });
}

module.exports = app;