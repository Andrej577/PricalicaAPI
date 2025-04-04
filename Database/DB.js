require('dotenv').config(); // učitavanje .env fajla
const { Pool } = require('pg');

// Konfiguracija konekcije
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Test konekcije
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