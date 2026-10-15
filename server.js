import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import router from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
app.set('view engine', 'ejs');
// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files setup
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'cse340-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Global middleware to set res.locals variables for all templates
app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null;
    }
    res.locals.NODE_ENV = NODE_ENV;

    next();
});

// Routes
app.use('/', router);

// Catch-all for 404 errors
app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('errors/500', {
        title: 'Server Error',
        error: err,
        stack: err.stack
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);

});