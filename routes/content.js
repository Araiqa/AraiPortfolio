const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'araigg2005';

// Middleware для проверки токена и ролей
const authorize = (roles = []) => {
    return (req, res, next) => {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

// Админ-доступ
router.get('/admin', authorize(['admin']), (req, res) => {
    res.json({ message: 'Welcome to the admin panel!' });
});

// Редактор-доступ
router.get('/editor', authorize(['editor', 'admin']), (req, res) => {
    res.json({ message: 'Welcome to the editor panel!' });
});

module.exports = router;
