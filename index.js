const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { testConnection } = require('./DBContext/DB');

app.get('/', (req, res) => {
    res.send('Pozdrav iz Node.js aplikacije2');
});


testConnection();

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});