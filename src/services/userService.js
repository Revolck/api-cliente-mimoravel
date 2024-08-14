const bcrypt = require('bcrypt');
const pool = require('../config/db');
const auth = require('../config/auth');

// Função para verificar se um CPF ou e-mail já está cadastrado
const checkDuplicate = async (cpf, email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE cpf = ? OR email = ?', [cpf, email]);
    return rows.length > 0;
};

// Função para adicionar um novo usuário
const addUser = async (userData) => {
    const { nome_completo, cpf, email, telefone, senha, perfil_imagem_url } = userData;
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Verifica duplicidade antes de inserir o usuário
    if (await checkDuplicate(cpf, email)) {
        throw new Error('CPF ou Email já cadastrado.');
    }

    const [result] = await pool.query(
        'INSERT INTO users (nome_completo, cpf, email, telefone, senha, perfil_imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
        [nome_completo, cpf, email, telefone, hashedPassword, perfil_imagem_url]
    );

    return { id: result.insertId };
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

        // Log para verificar os valores
        console.log('Senha fornecida:', senha);
        console.log('Hash armazenado:', user.senha);

        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            throw new Error('Senha incorreta.');
        }

        const token = auth.generateToken({ id: user.id, email: user.email });
        return { token, user: { id: user.id, email: user.email } };
    } catch (error) {
        console.error(error); // Log do erro para depuração
        throw error;
    }
};

module.exports = {
    addUser,
    loginUser,
};
