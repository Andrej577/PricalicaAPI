const request = require('supertest');
const app = require('../index.js');

const { pool } = require('../Database/DB');

test('GET /korisnici', async () => {
    const res = await request(app).get('/korisnici');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('GET /knjige', async () => {
    const res = await request(app).get('/knjige');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('GET /analitka', async () => {
    const res = await request(app).get('/analitika');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('GET /interakcije', async () => {
    const res = await request(app).get('/interakcije');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('GET /povijest_slusanja', async () => {
    const res = await request(app).get('/povijest_slusanja');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('GET /transakcije', async () => {
    const res = await request(app).get('/transakcije');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('GET /zanrovi', async () => {
    const res = await request(app).get('/zanrovi');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

afterAll(async () => {
    await pool.end(); //zatvori konekcijski pool - problemi sa Jestom jer ne moze zatvoriti konekciju sa bazom
});