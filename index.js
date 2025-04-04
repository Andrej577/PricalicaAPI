const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { testConnection } = require('./Database/DB');
const korisniciRoutes = require('./Routes/korisnici');
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Pozdrav iz Node.js aplikacije');
});

app.use('/korisnici', korisniciRoutes);

testConnection();

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});