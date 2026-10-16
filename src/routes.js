import express from 'express';

import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    joinProjectVolunteer,
    leaveProjectVolunteer,
    showNewProjectForm, 
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation,
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

import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersManagementPage
} from './controllers/users.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/organizations');
});

// User authentication routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// Public / General views for viewing listings and details
router.get('/projects', showProjectsPage);

router.get('/project/:projectId', showProjectDetailsPage);

// Protected Volunteer routes (Requieren que el usuario haya iniciado sesión)
router.post('/project/:projectId/volunteer', requireLogin, joinProjectVolunteer);
router.post('/project/:projectId/unvolunteer', requireLogin, leaveProjectVolunteer);

router.get('/organizations', showOrganizationsPage);

router.get('/organization/:organizationId', showOrganizationDetailsPage);
router.get('/organizations/:organizationId', showOrganizationDetailsPage);

router.get('/categories', showCategoriesPage);

router.get('/category/:categoryId', showCategoryDetailsPage);

// Admin-only protected routes (Requieren login y rol de administrador)
router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireLogin, requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireLogin, requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireLogin, requireRole('admin'), projectValidation, processEditProjectForm);

router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireLogin, requireRole('admin'), processNewOrganizationForm);

router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireLogin, requireRole('admin'), categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryValidation, processEditProjectForm);

router.get('/assign-categories/:projectId', requireLogin, requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireLogin, requireRole('admin'), processAssignCategoriesForm);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/admin/users', requireLogin, requireRole('admin'), showUsersManagementPage);

export default router;