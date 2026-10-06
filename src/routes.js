import express from 'express';

import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation 
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
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    categoryValidation
} from './controllers/categories.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/organizations');
});


router.get('/projects', showProjectsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/project/:projectId', showProjectDetailsPage);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);


router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', processNewOrganizationForm);
router.get('/organization/:organizationId', showOrganizationDetailsPage);


router.get('/categories', showCategoriesPage);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/category/:categoryId', showCategoryDetailsPage);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);


router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

export default router;