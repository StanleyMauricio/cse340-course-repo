import pool from './db.js'; 

// 1. enroll a user as a volunteer in a specific project
export const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteers (user_id, project_id) 
        VALUES ($1, $2) 
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `;
    await pool.query(query, [userId, projectId]);
};

// 2. remove a user from a project
export const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteers 
        WHERE user_id = $1 AND project_id = $2;
    `;
    await pool.query(query, [userId, projectId]);
};

// 3. check if a user is already a volunteer for a specific project
export const checkVolunteerStatus = async (userId, projectId) => {
    const query = `
        SELECT * FROM volunteers 
        WHERE user_id = $1 AND project_id = $2;
    `;
    const { rows } = await pool.query(query, [userId, projectId]);
    return rows.length > 0; 
};

// 4. get all projects a user has volunteered for
export const getVolunteeredProjectsByUser = async (userId) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.project_date AS date,
            p.location,
            p.organization_id
        FROM project p
        JOIN volunteers v ON p.project_id = v.project_id
        WHERE v.user_id = $1;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
};