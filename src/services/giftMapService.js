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

const deleteGiftMapByRespondentId = async (respondentId) => {
    try {
        // Inicia a transação
        const conn = await connection.getConnection();
        await conn.beginTransaction();

        // Deleta os dados da tabela gift_map
        const [giftMapResult] = await conn.query('DELETE FROM gift_map WHERE respondent_id = ?', [respondentId]);

        if (giftMapResult.affectedRows === 0) {
            throw new Error('Nenhum dado encontrado para o respondente fornecido.');
        }

        // Deleta os dados da tabela respondents
        const [respondentResult] = await conn.query('DELETE FROM respondents WHERE id = ?', [respondentId]);

        if (respondentResult.affectedRows === 0) {
            throw new Error('Nenhum respondente encontrado com o ID fornecido.');
        }

        // Confirma a transação
        await conn.commit();
        conn.release(); // Libera a conexão
    } catch (err) {
        if (conn) {
            await conn.rollback(); // Desfaz a transação em caso de erro
            conn.release();
        }
        throw new Error('Erro ao deletar os dados: ' + err.message);
    }
};


module.exports = {
    getGiftMap,
    addGiftMap,
    getAllGiftMaps,
    deleteGiftMapByRespondentId,
};
