import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getCategoriesByProjectId(projectId);

        res.render('project', {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        next(error);
    }
};

export { showProjectsPage, showProjectDetailsPage };