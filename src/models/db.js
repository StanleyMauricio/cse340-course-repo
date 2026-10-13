import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('render.com')
        ? { rejectUnauthorized: false }
        : false,
    max: 10, // Máximo de conexiones en el pool
    idleTimeoutMillis: 30000, // Cierra conexiones inactivas después de 30s limpiamente
    connectionTimeoutMillis: 10000, // Tiempo de espera para conectar (10 segundos)
});

// Manejar errores de conexiones inactivas para evitar caídas del servidor
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