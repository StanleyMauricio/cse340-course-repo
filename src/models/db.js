import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }
    : false
});

const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', res.rows[0].current_time);
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

const query = (text, params) => pool.query(text, params);

export default {
  query,
};

export { testConnection };