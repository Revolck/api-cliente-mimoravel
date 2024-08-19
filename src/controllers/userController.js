const userService = require('../services/userService');

exports.addUser = async (req, res, next) => {
    const { nome_completo, cpf, email, telefone, senha } = req.body;

    try {
        const newUser = await userService.addUser({ nome_completo, cpf, email, telefone, senha });
        return res.status(201).json(newUser);
    } catch (error) {
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
        if (error.message === 'E-mail não encontrado.' || error.message === 'Senha incorreta.') {
            return res.status(401).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
};

exports.updateUserProfile = async (req, res, next) => {
    const { username } = req.params; // Pega o username da URL
    const { senha, perfil_imagem_url } = req.body;

    try {
        await userService.updateUserProfile(username, { senha, perfil_imagem_url });
        res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

exports.getUserProfile = async (req, res, next) => {
    const { username } = req.params;
    console.log(`Buscando perfil para username: ${username}`);
    try {
        const user = await userService.getUserByUsername(username);
        console.log('Usuário encontrado:', user);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};
