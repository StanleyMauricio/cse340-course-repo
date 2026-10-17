import bcrypt from 'bcrypt';
import { createUserByEmail, findUserByEmail, getAllUsersWithRoles } from '../models/users.js';
import { getVolunteeredProjectsByUser } from '../models/volunteers.js';

export const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register',
        formData: {},
        errors: []
    });
};

export const processUserRegistrationForm = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.render('register', {
                title: 'Register',
                formData: { name, email },
                errors: [{ msg: 'Email is already registered.' }]
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await createUserByEmail(name, email, hashedPassword, 1);

        res.redirect('/login');
    } catch (error) {
        next(error);
    }
};

export const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login',
        error: null
    });
};

export const processLoginForm = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await findUserByEmail(email);
        if (!user) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password.'
            });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.render('login', {
                title: 'Login',
                error: 'Invalid email or password.'
            });
        }

        // Guardar sesión 
        req.session.user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role_name: user.role_name
        };

        res.redirect('/dashboard');
    } catch (error) {
        next(error);
    }
};

export const processLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
};

// Middleware to check if the user is logged in
export const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Middleware para verificar el rol de administrador
export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role_name === role) {
            return next();
        }
        res.redirect('/dashboard');
    };
};

export const showDashboard = async (req, res, next) => {
    try {
        const userId = req.session.user.user_id;
        const volunteeredProjects = await getVolunteeredProjectsByUser(userId);

        res.render('dashboard', {
            title: 'User Dashboard',
            name: req.session.user?.name || '',
            email: req.session.user?.email || '',
            user: req.session.user || null,
            volunteeredProjects
        });
    } catch (error) {
        next(error);
    }
};

export const showUsersManagementPage = async (req, res, next) => {
    try {
        const users = await getAllUsersWithRoles();
        res.render('admin-users', {
            title: 'Manage Users',
            users: users,
            user: req.session.user || null
        });
    } catch (error) {
        next(error);
    }
};