import express from 'express';

import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm 
} from './controllers/projects.js';

import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm 
} from './controllers/organizations.js';

import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm 
} from './controllers/categories.js';

const router = express.Router();


router.get('/', (req, res) => {
    res.redirect('/organizations');
});

router.get('/projects', showProjectsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', processNewProjectForm);
router.get('/project/:projectId', showProjectDetailsPage);


router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', processNewOrganizationForm);
router.get('/organization/:organizationId', showOrganizationDetailsPage);


router.get('/categories', showCategoriesPage);
router.get('/category/:categoryId', showCategoryDetailsPage);

router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

export default router;