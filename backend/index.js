require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());
// Simple CORS for local dev (allow frontend on different port)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// CRUD for books
app.get('/api/books', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/books/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/books', async (req, res) => {
  const { isbn, title, author, category, year, status } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO books(isbn,title,author,category,year,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [isbn, title, author, category, year, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/books/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { isbn, title, author, category, year, status } = req.body;
  try {
    const result = await db.query(
      'UPDATE books SET isbn=$1,title=$2,author=$3,category=$4,year=$5,status=$6 WHERE id=$7 RETURNING *',
      [isbn, title, author, category, year, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await db.query('DELETE FROM books WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// initialize DB table then start
async function init() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        isbn TEXT,
        title TEXT,
        author TEXT,
        category TEXT,
        year INTEGER,
        status TEXT
      )
    `);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to init DB', err);
    process.exit(1);
  }
}

if (require.main === module) init();

module.exports = app;
