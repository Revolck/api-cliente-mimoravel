const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    // Log do erro
    logger.error(err.message, err);

    // Tratamento de erro específico para CPF ou Email já cadastrado
    if (err.message === 'CPF ou Email já cadastrado.') {
        return res.status(400).json({ message: err.message });
    }

    // Resposta de erro genérica
    res.status(err.status || 500).json({
        message: err.message || 'Erro interno do servidor.',
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

module.exports = errorHandler;
