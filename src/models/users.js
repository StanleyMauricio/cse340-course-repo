import db from './db.js';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    
    // Primero obtenemos el role_id de manera segura
    const roleQuery = `SELECT role_id FROM roles WHERE role_name = $1;`;
    const roleResult = await db.query(roleQuery, [default_role]);

    if (roleResult.rows.length === 0) {
        throw new Error(`Default role '${default_role}' not found in database.`);
    }

    const roleId = roleResult.rows[0].role_id;

   
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING user_id;
    `;
    const queryParams = [name, email, passwordHash, roleId];
    
    const result = await db.query(query, queryParams);
    
    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

export { createUser };