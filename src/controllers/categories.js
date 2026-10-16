import { body, validationResult } from 'express-validator';
import { 
    getAllCategories, 
    getCategoryDetails, 
    createCategory, 
    updateCategory,
    updateCategoryAssignments 
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];


const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', {
            title: 'Categories',
            categories
        });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId || req.params.id;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        res.render('category', {
            title: category.name,
            category,
            projects: category.projects 
        });
    } catch (error) {
        next(error);
    }
};

const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Add New Category'
    });
};

const processNewCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        await createCategory(name);

        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating category:', error);
        next(error);
    }
};


const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        res.render('update-category', {
            title: `Edit ${category.name}`,
            category
        });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);

        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        next(error);
    }
};


const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getAllCategories();
        res.render('assign-categories', {
            title: `Assign Categories to ${project.title}`,
            project,
            categories
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.projectId;
    let { categories } = req.body;

    if (!categories) {
        categories = [];
    } else if (!Array.isArray(categories)) {
        categories = [categories];
    }

    try {
        await updateCategoryAssignments(projectId, categories);
        
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error assigning categories:', error);
        next(error);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation
};