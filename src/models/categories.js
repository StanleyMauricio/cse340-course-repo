import db from './db.js';


const getAllCategories = async () => {
    const query = `
      SELECT
        category_id,
        name
      FROM category
      ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
};


const getCategoryDetails = async (categoryId) => {
    const categoryQuery = `
      SELECT
        category_id,
        name
      FROM category
      WHERE category_id = $1;
    `;
    const categoryResult = await db.query(categoryQuery, [categoryId]);
    
    if (categoryResult.rows.length === 0) {
        return null;
    }

    const category = categoryResult.rows[0];

    // Corregido: se usa 'project' en lugar de 'service_project'
    const projectsQuery = `
      SELECT
        p.project_id,
        p.title,
        p.description,
        p.location,
        p.project_date AS date
      FROM project p
      JOIN project_category pc ON p.project_id = pc.project_id
      WHERE pc.category_id = $1
      ORDER BY p.title;
    `;
    const projectsResult = await db.query(projectsQuery, [categoryId]);
    
    // Adjuntamos los proyectos para que la vista pueda iterar sobre ellos
    category.projects = projectsResult.rows;

    return category;
};


const createCategory = async (name) => {
    const query = `
      INSERT INTO category (name)
      VALUES ($1)
      RETURNING category_id;
    `;
    const result = await db.query(query, [name]);
    return result.rows[0].category_id;
};


const updateCategory = async (categoryId, name) => {
    const query = `
      UPDATE category
      SET name = $1
      WHERE category_id = $2
      RETURNING category_id;
    `;
    const result = await db.query(query, [name, categoryId]);
    if (result.rows.length === 0) {
        throw new Error('Failed to update category or category not found');
    }
    return result.rows[0].category_id;
};


const getCategoriesByServiceProjectId = async (projectId) => {
    const query = `
      SELECT
        c.category_id,
        c.name
      FROM category c
      JOIN project_category pc ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.name;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};


const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, category_id) DO NOTHING;
    `;
    await db.query(query, [categoryId, projectId]);
};


const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        if (categoryId) {
            await assignCategoryToProject(categoryId, projectId);
        }
    }
};

export {
    getAllCategories,
    getCategoryDetails,
    createCategory,
    updateCategory,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
};