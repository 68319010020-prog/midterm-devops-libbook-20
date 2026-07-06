const request = require('supertest');
const app = require('../index');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

const db = require('../db');

describe('Books API', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  test('GET /health returns status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('GET /api/books returns list', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 1, title: 'A' }] });
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/books creates book', async () => {
    const newBook = { isbn: '123', title: 'T', author: 'A', category: 'C', year: 2020, status: 'available' };
    db.query.mockResolvedValue({ rows: [{ id: 1, ...newBook }] });
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
