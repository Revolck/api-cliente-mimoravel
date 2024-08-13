const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Função para verificar se o CPF ou email já existe
const checkDuplicate = async (cpf, email) => {
    const [rows] = await pool.query(
        'SELECT cpf, email FROM users WHERE cpf = ? OR email = ?',
        [cpf, email]
    );
    
    if (rows.length > 0) {
        // Se encontrar um usuário com o mesmo CPF ou e-mail
        const duplicateField = rows[0].cpf === cpf ? 'CPF' : 'Email';
        throw new Error(`${duplicateField} já cadastrado.`);
    }
};

// Função para adicionar um novo usuário
const addUser = async (userData) => {
    const { nome_completo, cpf, email, telefone, senha, perfil_imagem_url } = userData;
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Verifica duplicidade antes de inserir o usuário
    await checkDuplicate(cpf, email);

    const [result] = await pool.query(
        'INSERT INTO users (nome_completo, cpf, email, telefone, senha, perfil_imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
        [nome_completo, cpf, email, telefone, hashedPassword, perfil_imagem_url]
    );

    return { id: result.insertId };
};

module.exports = {
    addUser
};
