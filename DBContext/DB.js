require('dotenv').config(); // učitavanje .env fajla
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // isključi SQL logove
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Spojeni na PostgreSQL bazu! Bravo');
    } catch (error) {
        console.error('Greška pri spajanjeu:', error);
    }
}


module.exports = {
    testConnection
};