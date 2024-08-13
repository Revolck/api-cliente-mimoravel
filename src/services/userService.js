const bcrypt = require('bcrypt');
const pool = require('../config/db');

const checkDuplicate = async (cpf, email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE cpf = ? OR email = ?', [cpf, email]);
    return rows.length > 0;
};

const addUser = async (userData) => {
    const { nome_completo, cpf, email, telefone, senha, perfil_imagem_url } = userData;
    const hashedPassword = await bcrypt.hash(senha, 10);

    if (await checkDuplicate(cpf, email)) {
        throw new Error('CPF ou Email já cadastrado.');
    }

    const [result] = await pool.query(
        'INSERT INTO users (nome_completo, cpf, email, telefone, senha, perfil_imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
        [nome_completo, cpf, email, telefone, hashedPassword, perfil_imagem_url]
    );
    return { id: result.insertId };
};

module.exports = {
    addUser
};
