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
    let conn;
    try {
        conn = await connection.getConnection();
        await conn.beginTransaction();

        // Primeiro, exclui os registros da tabela gift_map que referenciam o respondentId
        await conn.query('DELETE FROM gift_map WHERE respondent_id = ?', [respondentId]);

        // Depois, exclui o respondente da tabela respondents
        const [respondentResult] = await conn.query('DELETE FROM respondents WHERE id = ?', [respondentId]);

        if (respondentResult.affectedRows === 0) {
            throw new Error('Nenhum respondente encontrado com o ID fornecido.');
        }

        await conn.commit();
    } catch (err) {
        if (conn) {
            await conn.rollback();
        }
        console.error('Erro ao deletar os dados:', err.message);
        throw new Error('Erro ao deletar os dados: ' + err.message);
    } finally {
        if (conn) {
            conn.release();
        }
    }
};


const getGiftMapById = async (giftMapId) => {
    try {
        const [giftMapData] = await connection.query(
            `SELECT gm.*, r.nome AS respondent_nome, r.email AS respondent_email, r.telefone AS respondent_telefone, 
                    r.cidade AS respondent_cidade, GROUP_CONCAT(t.nome) AS tags 
             FROM gift_map gm
             LEFT JOIN respondents r ON gm.respondent_id = r.id
             LEFT JOIN gift_map_tags gmt ON gm.id = gmt.gift_map_id
             LEFT JOIN tags t ON gmt.tag_id = t.id
             WHERE gm.id = ?
             GROUP BY gm.id, r.nome, r.email, r.telefone, r.cidade`,
            [giftMapId]
        );

        return giftMapData[0]; // Retorna o primeiro resultado
    } catch (err) {
        throw new Error('Erro ao obter detalhes do gift_map: ' + err.message);
    }
};

module.exports = {
    getGiftMap,
    addGiftMap,
    getAllGiftMaps,
    deleteGiftMapByRespondentId,
    getGiftMapById,
};
