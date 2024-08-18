const bcrypt = require('bcrypt');
const pool = require('../config/db');
const auth = require('../config/auth');

// Função para gerar o username
const generateUsername = (nomeCompleto) => {
    return nomeCompleto
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0)
        .slice(0, 2) // Pega apenas os dois primeiros nomes
        .join('-'); // Une com hífen
};

// Função para verificar se um CPF ou e-mail já está cadastrado
const checkDuplicate = async (cpf, email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE cpf = ? OR email = ?', [cpf, email]);
    return rows.length > 0;
};

// Função para adicionar um novo usuário
const addUser = async (userData) => {
    const { nome_completo, cpf, email, telefone, senha, perfil_imagem_url } = userData;
    const username = generateUsername(nome_completo);
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Verifica duplicidade antes de inserir o usuário
    if (await checkDuplicate(cpf, email)) {
        throw new Error('CPF ou Email já cadastrado.');
    }

    const [result] = await pool.query(
        'INSERT INTO users (nome_completo, username, cpf, email, telefone, senha, perfil_imagem_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nome_completo, username, cpf, email, telefone, hashedPassword, perfil_imagem_url]
    );

    return { id: result.insertId, username }; // Inclui o username na resposta
};

// Função para realizar o login do usuário
const loginUser = async (email, senha) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            throw new Error('E-mail não encontrado.');
        }

        const user = rows[0];
        if (!user.senha) {
            throw new Error('Senha não encontrada para o usuário.');
        }

        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            throw new Error('Senha incorreta.');
        }

        const token = auth.generateToken({ id: user.id, email: user.email });
        return { token, user: { id: user.id, email: user.email, username: user.username } };
    } catch (error) {
        throw error;
    }
};

// Função para atualizar o perfil do usuário com base no username
const updateUserProfile = async (username, { senha, perfil_imagem_url }) => {
    // Primeiro, obtenha o ID do usuário com base no username
    const [userRows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);

    if (userRows.length === 0) {
        throw new Error('Usuário não encontrado.');
    }

    const userId = userRows[0].id;
    let updateQuery = 'UPDATE users SET';
    let params = [];
    
    if (senha) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        updateQuery += ' senha = ?';
        params.push(hashedPassword);
    }

    if (perfil_imagem_url) {
        if (params.length > 0) updateQuery += ',';
        updateQuery += ' perfil_imagem_url = ?';
        params.push(perfil_imagem_url);
    }

    updateQuery += ' WHERE id = ?';
    params.push(userId);

    await pool.query(updateQuery, params);
};

module.exports = {
    addUser,
    loginUser,
    updateUserProfile,
};
