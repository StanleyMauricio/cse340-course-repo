import db from './db.js';

// get all categories
const getAllCategories = async () => {
    const query = `
      SELECT category_id, name, description 
      FROM category 
      ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
};

// 1. recover a single category by its ID
const getCategoryById = async (categoryId) => {
    const query = `
      SELECT category_id, name, description 
      FROM category 
      WHERE category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// 2. recover all categories for a specific service project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
      SELECT c.category_id, c.name, c.description
      FROM category c
      JOIN project_category pc ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.name ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// 3. recover all service projects for a specific category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
      SELECT p.project_id, p.title, p.description, p.date, p.location
      FROM project p
      JOIN project_category pc ON p.project_id = pc.project_id
      WHERE pc.category_id = $1
      ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId
};