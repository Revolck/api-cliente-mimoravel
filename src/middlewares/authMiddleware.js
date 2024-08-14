const jwt = require('jsonwebtoken');
const { verifyToken } = require('../config/auth');

const authMiddleware = (req, res, next) => {
    // O token deve estar no formato "Bearer [token]"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido.' });
    }
};

module.exports = authMiddleware;
