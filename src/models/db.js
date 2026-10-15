import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1'))
        ? { rejectUnauthorized: false }
        : false,
    max: 10, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 10000, 
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
});

const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', res.rows[0].current_time);
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

// Ejecutar la prueba de conexión al iniciar
testConnection();

const query = async (text, params) => {
    try {
        return await pool.query(text, params);
    } catch (err) {
        console.error('Database query error:', err.message);
        throw err;
    }
};

export default {
    query,
};

export { testConnection };