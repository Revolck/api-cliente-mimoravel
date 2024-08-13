const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.message, err);

    if (err.message === 'CPF ou Email já cadastrado.') {
        return res.status(400).json({ message: err.message });
    }

    res.status(err.status || 500).json({
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = errorHandler;
