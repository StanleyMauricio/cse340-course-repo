import { getAllOrganizations, getOrganizationById, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

export const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', {
            title: 'Partner Organizations',
            organizations: organizations,
            user: req.session.user || null
        });
    } catch (error) {
        next(error);
    }
};

export const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.organizationId;
        const organization = await getOrganizationById(organizationId);
        
        if (!organization) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        // Recover the projects associated with the organization
        const projects = await getProjectsByOrganizationId(organizationId);

        res.render('organization', {
            title: organization.name,
            organization: organization,
            projects: projects,
            user: req.session.user || null
        });
    } catch (error) {
        next(error);
    }
};

export const showNewOrganizationForm = (req, res) => {
    res.render('new-organization', {
        title: 'Add New Organization',
        user: req.session.user || null,
        formData: {}
    });
};

export const processNewOrganizationForm = async (req, res, next) => {
    try {
        const { name, description, contact_email, logo_filename } = req.body;
        await createOrganization(name, description, contact_email, logo_filename);
        res.redirect('/organizations'); 
    } catch (error) {
        next(error);
    }
};

export const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.organizationId || req.params.id;
        const organization = await getOrganizationById(organizationId);

        if (!organization) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        res.render('update-organization', {
            title: `Edit ${organization.name}`,
            organization: organization,
            user: req.session.user || null
        });
    } catch (error) {
        next(error);
    }
};

export const processEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.organizationId || req.params.id;
        const { name, description } = req.body;

        await updateOrganization(organizationId, name, description);
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        next(error);
    }
};