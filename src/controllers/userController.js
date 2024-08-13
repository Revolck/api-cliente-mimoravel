const userService = require('../services/userService');

exports.addUser = async (req, res, next) => {
    const { nome_completo, cpf, email, telefone, senha } = req.body;

    try {
        // Verifica se o CPF já existe
        let user = await userService.getUserByCPF(cpf);
        if (user) {
            return res.status(400).json({ error: 'CPF já cadastrado.' });
        }

        // Verifica se o e-mail já existe
        user = await userService.getUserByEmail(email);
        if (user) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        // Criação do usuário
        const newUser = await userService.createUser({ nome_completo, cpf, email, telefone, senha });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
};
