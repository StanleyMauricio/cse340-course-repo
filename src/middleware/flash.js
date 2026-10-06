/**
 * Flash Message Middleware
 * Stores temporary messages in session that clear upon retrieval.
 */

const flashMiddleware = (req, res, next) => {
    req.flash = function(type, message) {
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // SETTING: Two arguments
        if (type && message) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            req.session.flash[type].push(message);
            return;
        }

        // GETTING ONE TYPE: One argument
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        // GETTING ALL: No arguments
        const allMessages = req.session.flash || {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return allMessages;
    };
    next();
};

const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash;
    next();
};

const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;