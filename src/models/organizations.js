import db from './db.js';

const getAllOrganizations = async () => {
    const query = `
      SELECT
        organization_id,
        name,
        description
      FROM organization
      ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getOrganizationById = async (organizationId) => {
    const query = `
      SELECT
        organization_id,
        name,
        description
      FROM organization
      WHERE organization_id = $1;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
      INSERT INTO organization (name, description)
      VALUES ($1, $2)
      RETURNING organization_id
    `;
    // Omitimos contactEmail y logoFilename si la base de datos no tiene esas columnas todavía
    const queryParams = [name, description];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].organization_id);
    }

    return result.rows[0].organization_id;
};

const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
    const query = `
        UPDATE organization
        SET name = $1, description = $2
        WHERE organization_id = $3
        RETURNING organization_id;
    `;
    const queryParams = [name, description, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Organization not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated organization with ID:', organizationId);
    }

    return result.rows[0].organization_id;
};

export {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization
};