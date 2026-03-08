const request = require('supertest');
const app = require('../index.js');
const { pool } = require('../Database/DB');

test('POST /login - should fail for invalid credentials', async () => {
    const res = await request(app)
        .post('/login')
        .send({
            email: 'krivi@test.com',
            lozinka: 'kriva'
        });

    expect([400, 401]).toContain(res.statusCode);
});

afterAll(async () => {
    await pool.end();
});