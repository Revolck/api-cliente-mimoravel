const pool = require('../config/db');

// Função para verificar se um CPF já existe
const getUserByCPF = async (cpf) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE cpf = ?', [cpf]);
    return rows.length > 0;
};

// Função para adicionar um novo usuário
const addUser = async (userData) => {
    const { nome_completo, cpf, email, telefone, senha, perfil_imagem_url } = userData;
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Verifica duplicidade antes de inserir o usuário
    if (await getUserByCPF(cpf) || await getUserByEmail(email)) {
        throw new Error('CPF ou Email já cadastrado.');
    }

    const [result] = await pool.query(
        'INSERT INTO users (nome_completo, cpf, email, telefone, senha, perfil_imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
        [nome_completo, cpf, email, telefone, hashedPassword, perfil_imagem_url]
    );

    return { id: result.insertId };
};

module.exports = {
    addUser,
    getUserByCPF
};
