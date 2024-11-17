const jwt = require('jsonwebtoken');
const SECRET_KEY = 'araigg2005';

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
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

module.exports = authorize;
