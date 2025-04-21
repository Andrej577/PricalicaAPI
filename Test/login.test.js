const request = require('supertest');
const app = require('../index.js');
const { pool } = require('../Database/DB');

test('POST /login - ispravni podaci', async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: 'luka.babic@example.com',
            lozinka: 'LukaBest88'
        });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Prijava uspješna');
});

test('POST /login - pogrešna lozinka', async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: 'test@example.com',
            lozinka: 'kriva'
        });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
});

test('POST /login - nepostojeći korisnik', async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: 'nepostojeci@example.com',
            lozinka: 'bilošta'
        });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
});

afterAll(async () => {
    await pool.end(); // da Jest ne poludi zbog konekcije
});
