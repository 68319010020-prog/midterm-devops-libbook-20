const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'libbook',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
