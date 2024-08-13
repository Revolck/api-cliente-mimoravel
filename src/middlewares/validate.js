const { body, validationResult } = require('express-validator');

const validateUser = [
    body('email').isEmail().withMessage('Email inválido'),
    body('cpf').isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 caracteres'),
    // Adicione outras validações conforme necessário
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateUser
};
