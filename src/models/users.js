import db from './db.js';

export const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;
    const result = await db.query(query, [email]);
    return result.rows[0];
};

export const createUserByEmail = async (name, email, passwordHash, roleId = 2) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, name, email, role_id;
    `;
    const result = await db.query(query, [name, email, passwordHash, roleId]);
    return result.rows[0];
};

export const getAllUsersWithRoles = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.user_id ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};