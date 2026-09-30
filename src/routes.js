import express from 'express';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';

const router = express.Router();

// Rutas de Organizaciones
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Rutas de Proyectos
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Rutas de Categorías
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

export default router;