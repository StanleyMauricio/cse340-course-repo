import { body, validationResult } from 'express-validator';
import { 
    getUpcomingProjects, 
    getProjectDetails, 
    createProject,
    updateProject 
} from '../models/projects.js';
import { getCategoriesByServiceProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { 
    addVolunteer, 
    removeVolunteer, 
    checkVolunteerStatus 
} from '../models/volunteers.js';

// Validation rules for project form inputs
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// show the list of upcoming projects
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(10);
        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });
    } catch (error) {
        next(error);
    }
};

// show the details of a specific project (updated with volunteer status)
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.projectId || req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getCategoriesByServiceProjectId(projectId);

        let isVolunteer = false;
        if (req.session && req.session.user) {
            isVolunteer = await checkVolunteerStatus(req.session.user.user_id, projectId);
        }

        res.render('project', {
            title: project.title,
            project,
            categories,
            isVolunteer
        });
    } catch (error) {
        next(error);
    }
};

// process user joining as a volunteer
const joinProjectVolunteer = async (req, res, next) => {
    try {
        console.log("EJECUTANDO JOIN VOLUNTEER PARA PROYECTO:", req.params.projectId || req.params.id);
        const projectId = req.params.projectId || req.params.id;
        const userId = req.session.user.user_id;

        await addVolunteer(userId, projectId);
        
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("ERROR EN JOIN:", error);
        next(error);
    }
};
// process user leaving as a volunteer
const leaveProjectVolunteer = async (req, res, next) => {
    try {
        const projectId = req.params.projectId || req.params.id;
        const userId = req.session.user.user_id;

        await removeVolunteer(userId, projectId);
        
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

// show the form for creating a new project
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';
        res.render('new-project', { title, organizations });
    } catch (error) {
        next(error);
    }
};

// process the creation of a new project
const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        res.redirect('/new-project');
    }
};

// show the form for editing an existing project
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const organizations = await getAllOrganizations();
        
        const formattedDate = new Date(project.date).toISOString().split('T')[0];
        project.formattedDate = formattedDate;

        res.render('update-project', {
            title: `Edit ${project.title}`,
            project,
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// process the submission of the project edit form
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        res.redirect(`/edit-project/${projectId}`);
    }
};

export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    joinProjectVolunteer,
    leaveProjectVolunteer,
    showNewProjectForm, 
    processNewProjectForm, 
    showEditProjectForm,
    processEditProjectForm,
    projectValidation 
};