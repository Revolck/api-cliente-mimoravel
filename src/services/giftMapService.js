const connection = require('../config/db');

const getGiftMap = async (search) => {
    let query = `
        SELECT gm.id, r.nome AS name, r.email, r.telefone AS phone, r.cidade AS city, gm.data_criacao AS sendDate, gm.status_contato AS status
        FROM gift_map gm
        JOIN respondents r ON gm.respondent_id = r.id
    `;

    const params = [];

    if (search) {
        query += `
            WHERE r.nome LIKE ? OR r.email LIKE ? OR r.telefone LIKE ?
        `;
        const searchValue = `%${search}%`; // Usa o wildcard '%' para pesquisa parcial
        params.push(searchValue, searchValue, searchValue);
    }

    try {
        const [rows] = await connection.query(query, params);
        return rows;
    } catch (err) {
        throw new Error('Erro ao obter respostas do quizz: ' + err.message);
    }
};

const getAllGiftMaps = async () => {
    const [rows] = await db.query(`
      SELECT gm.id, r.nome AS name, r.email, r.telefone AS phone, r.cidade AS city, gm.data_criacao AS sendDate, gm.status_contato AS status
      FROM gift_map gm
      JOIN respondents r ON gm.respondent_id = r.id
    `);
    return rows;
};

const addGiftMap = async (giftMapData) => {
    const { respondent_id, ocasiao, relacionamento, paixoes_hobbies, estilo, melhores_momentos, valores, desejos, avesso_a, status_contato } = giftMapData;
    try {
        const [result] = await connection.query(
            'INSERT INTO gift_map (respondent_id, ocasiao, relacionamento, paixoes_hobbies, estilo, melhores_momentos, valores, desejos, avesso_a, status_contato) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [respondent_id, ocasiao, relacionamento, paixoes_hobbies, estilo, melhores_momentos, valores, desejos, avesso_a, status_contato]
        );
        return { id: result.insertId };
    } catch (err) {
        throw new Error('Erro ao adicionar resposta do quizz: ' + err.message);
    }
};

const deleteGiftMapById = async (id) => {
    const query = 'DELETE FROM gift_map WHERE id = ?';
    return db.query(query, [id]);
};

module.exports = {
    getGiftMap,
    addGiftMap,
    getAllGiftMaps,
    deleteGiftMapById,
};
