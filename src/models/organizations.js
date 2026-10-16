import db from './db.js';

const getLogoFilename = (id) => {
    switch (Number(id)) {
        case 1: return 'brightfuture-logo.png';
        case 2: return 'greenharvest-logo.png';
        case 3: return 'unityserve-logo.png';
        default: return 'placeholder-logo.png';
    }
};

export const getAllOrganizations = async () => {
    const query = `
      SELECT
        organization_id,
        name,
        description
      FROM organization
      ORDER BY name;
    `;
    const result = await db.query(query);
    
    return result.rows.map(org => ({
        ...org,
        logo_filename: getLogoFilename(org.organization_id)
    }));
};

export const getOrganizationById = async (organizationId) => {
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
    if (result.rows.length === 0) return null;
    
    const org = result.rows[0];
    org.logo_filename = getLogoFilename(org.organization_id);
    return org;
};

export const createOrganization = async (name, description, contact_email, logo_filename) => {
    const query = `
        INSERT INTO organization (name, description)
        VALUES ($1, $2)
        RETURNING organization_id;
    `;
    const values = [name, description];
    const result = await db.query(query, values);
    return result.rows[0].organization_id;
};

export const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
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

    

    return result.rows[0].organization_id;
};

