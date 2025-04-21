require('dotenv').config(); // učitavanje .env fajla
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});


// Dali da se ubaci da se servis niti ne pokrece ako se ne moze spojiti sa bazom??
// Poanta servisa i je da se spoji sa bazom, ako to ne moze onda sta???
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Spojeni na PostgreSQL bazu! Bravo');
        client.release();
    } catch (error) {
        console.error('Greška pri spajanju:', error);
    }
}

module.exports = {
    pool,
    testConnection,
};