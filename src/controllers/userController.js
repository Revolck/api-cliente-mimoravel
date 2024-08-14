const userService = require('../services/userService');

exports.addUser = async (req, res, next) => {
    const { nome_completo, cpf, email, telefone, senha } = req.body;

    try {
        // Adiciona o usuário
        const newUser = await userService.addUser({ nome_completo, cpf, email, telefone, senha });
        return res.status(201).json(newUser);
    } catch (error) {
        // Verifica o tipo do erro
        if (error.message.includes('CPF ou Email já cadastrado')) {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, senha } = req.body;
        const result = await userService.loginUser(email, senha);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
