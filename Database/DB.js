require('dotenv').config(); // učitavanje .env fajla
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ako ne može spojiti bazu, možemo prekinuti aplikaciju
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Spojeni na MySQL bazu! Bravo');
        connection.release();
    } catch (error) {
        console.error('Greška pri spajanju s MySQL bazom:', error);
        process.exit(1); // zatvori aplikaciju ako nema konekcije
    }
}

module.exports = {
    pool,
    testConnection,
};
