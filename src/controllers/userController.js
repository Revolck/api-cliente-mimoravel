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
        // Verifica o tipo do erro
        if (error.message === 'E-mail não encontrado.' || error.message === 'Senha incorreta.') {
            return res.status(401).json({ error: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
};

exports.updateUserProfile = async (req, res, next) => {
    const userId = req.user.id; // Assumindo que o ID do usuário está no req.user após autenticação
    const { senha, perfil_imagem_url } = req.body;

    try {
        await userService.updateUserProfile(userId, { senha, perfil_imagem_url });
        res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

exports.getUserProfile = async (req, res, next) => {
    const { username } = req.params;
    try {
        const [rows] = await pool.query('SELECT email, telefone, perfil_imagem_url FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
};

