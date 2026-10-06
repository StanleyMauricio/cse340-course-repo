import { getProjectDetails } from '../models/projects.js';
import { 
    getAllCategories, 
    getCategoryDetails, 
    getCategoriesByServiceProjectId, 
    updateCategoryAssignments 
} from '../models/categories.js';

// show all categories
const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).render('errors/error', { title: 'Server Error', error });
    }
};

// show details of a specific category
const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            return res.status(404).render('errors/error', { 
                title: 'Category Not Found', 
                error: { message: 'Category not found' } 
            });
        }

        const title = category.name;
        res.render('category', { title, category });
    } catch (error) {
        console.error('Error fetching category details:', error);
        res.status(500).render('errors/error', { title: 'Server Error', error });
    }
};

// show the form for assigning categories to a project
const showAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projectDetails = await getProjectDetails(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByServiceProjectId(projectId);
        const title = 'Assign Categories to Project';

        res.render('assign-categories', { 
            title, 
            projectId, 
            projectDetails, 
            categories, 
            assignedCategories 
        });
    } catch (error) {
        console.error('Error rendering assign categories form:', error);
        res.status(500).render('errors/error', { title: 'Server Error', error });
    }
};

// Process the form submission for assigning categories to a project
const processAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];
        
        // Ensure that categoryIds is always an array
        const categoryIdsArray = Array.isArray(selectedCategoryIds) 
            ? selectedCategoryIds 
            : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);

        if (req.flash) {
            req.flash('success', 'Categories updated successfully.');
        }

        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error processing category assignments:', error);
        res.status(500).render('errors/error', { title: 'Server Error', error });
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};