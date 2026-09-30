import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    
    // LÍNEA DE DIAGNÓSTICO:
    console.log("CANTIDAD DE ORGANIZACIONES EN DB:", organizations.length);

    res.render('organizations', { title: 'Organizations', organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organization = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    
    res.render('organization', {
        title: organization ? organization.name : 'Organization Details',
        organization,
        projects
    });
};

export { showOrganizationsPage, showOrganizationDetailsPage };