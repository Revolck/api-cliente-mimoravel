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
    const [rows] = await connection.query(`
      SELECT gm.id, r.nome AS name, r.email, r.telefone AS phone, r.cidade AS city, gm.data_criacao AS sendDate, gm.status_contato AS status
      FROM gift_map gm
      JOIN respondents r ON gm.respondent_id = r.id
    `);
    return rows;
};

const addGiftMap = async (giftMapData) => {
    const { respondent_id, special_occasion_id, relationship_with_gifted_id, interests_and_passions_id, style_and_personality_id, shared_memories_id, values_and_beliefs_id, unmet_wishes_id, dislikes_id, status_contato } = giftMapData;
    try {
        const [result] = await connection.query(
            'INSERT INTO gift_map (respondent_id, special_occasion_id, relationship_with_gifted_id, interests_and_passions_id, style_and_personality_id, shared_memories_id, values_and_beliefs_id, unmet_wishes_id, dislikes_id, status_contato) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [respondent_id, special_occasion_id, relationship_with_gifted_id, interests_and_passions_id, style_and_personality_id, shared_memories_id, values_and_beliefs_id, unmet_wishes_id, dislikes_id, status_contato]
        );
        return { id: result.insertId };
    } catch (err) {
        throw new Error('Erro ao adicionar resposta do quizz: ' + err.message);
    }
};

const deleteGiftMapById = async (giftMapId) => {
    let conn;
    try {
        conn = await connection.getConnection();
        await conn.beginTransaction();

        // Obtém o respondent_id a partir do gift_map_id
        const [result] = await conn.query('SELECT respondent_id FROM gift_map WHERE id = ?', [giftMapId]);
        if (result.length === 0) {
            throw new Error('Nenhum gift_map encontrado com o ID fornecido.');
        }
        const respondentId = result[0].respondent_id;

        // Exclui os registros das tabelas associadas ao gift_map_id
        await conn.query('DELETE FROM special_occasion WHERE id = (SELECT special_occasion_id FROM gift_map WHERE id = ?)', [giftMapId]);
        await conn.query('DELETE FROM relationship_with_gifted WHERE id = (SELECT relationship_with_gifted_id FROM gift_map WHERE id = ?)', [giftMapId]);
        await conn.query('DELETE FROM interests_and_passions WHERE id = (SELECT interests_and_passions_id FROM gift_map WHERE id = ?)', [giftMapId]);
        await conn.query('DELETE FROM style_and_personality WHERE id = (SELECT style_and_personality_id FROM gift_map WHERE id = ?)', [giftMapId]);
        await conn.query('DELETE FROM shared_memories WHERE id = (SELECT shared_memories_id FROM gift_map WHERE id = ?)', [giftMapId]);
        await conn.query('DELETE FROM values_and_beliefs WHERE id = (SELECT values_and_beliefs_id FROM gift_map WHERE id = ?)', [giftMapId]);
        await conn.query('DELETE FROM unmet_wishes WHERE id = (SELECT unmet_wishes_id FROM gift_map WHERE id = ?)', [giftMapId]);
        await conn.query('DELETE FROM dislikes WHERE id = (SELECT dislikes_id FROM gift_map WHERE id = ?)', [giftMapId]);

        // Exclui o gift_map
        await conn.query('DELETE FROM gift_map WHERE id = ?', [giftMapId]);

        // Se o respondente não estiver associado a nenhum outro gift_map, exclua o respondente
        const [respondentCheck] = await conn.query('SELECT COUNT(*) AS count FROM gift_map WHERE respondent_id = ?', [respondentId]);
        if (respondentCheck[0].count === 0) {
            const [respondentResult] = await conn.query('DELETE FROM respondents WHERE id = ?', [respondentId]);
            if (respondentResult.affectedRows === 0) {
                throw new Error('Nenhum respondente encontrado com o ID fornecido.');
            }
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
                    r.cidade AS respondent_cidade, 
                    (SELECT occasion FROM special_occasion WHERE id = gm.special_occasion_id) AS special_occasion,
                    (SELECT question_1 FROM relationship_with_gifted WHERE id = gm.relationship_with_gifted_id) AS relationship_question_1,
                    (SELECT question_2 FROM relationship_with_gifted WHERE id = gm.relationship_with_gifted_id) AS relationship_question_2,
                    (SELECT question_1 FROM interests_and_passions WHERE id = gm.interests_and_passions_id) AS interests_question_1,
                    (SELECT question_2 FROM interests_and_passions WHERE id = gm.interests_and_passions_id) AS interests_question_2,
                    (SELECT question_1 FROM style_and_personality WHERE id = gm.style_and_personality_id) AS style_question_1,
                    (SELECT question_2 FROM style_and_personality WHERE id = gm.style_and_personality_id) AS style_question_2,
                    (SELECT question_3 FROM style_and_personality WHERE id = gm.style_and_personality_id) AS style_question_3,
                    (SELECT question_4 FROM style_and_personality WHERE id = gm.style_and_personality_id) AS style_question_4,
                    (SELECT question_1 FROM shared_memories WHERE id = gm.shared_memories_id) AS shared_memories_question_1,
                    (SELECT question_2 FROM shared_memories WHERE id = gm.shared_memories_id) AS shared_memories_question_2,
                    (SELECT question_1 FROM values_and_beliefs WHERE id = gm.values_and_beliefs_id) AS values_question_1,
                    (SELECT question_2 FROM values_and_beliefs WHERE id = gm.values_and_beliefs_id) AS values_question_2,
                    (SELECT question_3 FROM values_and_beliefs WHERE id = gm.values_and_beliefs_id) AS values_question_3,
                    (SELECT question_4 FROM values_and_beliefs WHERE id = gm.values_and_beliefs_id) AS values_question_4,
                    (SELECT question_1 FROM unmet_wishes WHERE id = gm.unmet_wishes_id) AS unmet_wishes_question_1,
                    (SELECT question_2 FROM unmet_wishes WHERE id = gm.unmet_wishes_id) AS unmet_wishes_question_2,
                    (SELECT question_1 FROM dislikes WHERE id = gm.dislikes_id) AS dislikes_question_1
             FROM gift_map gm
             LEFT JOIN respondents r ON gm.respondent_id = r.id
             WHERE gm.id = ?`,
            [giftMapId]
        );

        return giftMapData[0]; // Retorna o primeiro resultado
    } catch (err) {
        throw new Error('Erro ao obter detalhes do gift_map: ' + err.message);
    }
};

const updateGiftMapStatusById = async (id, newStatus) => {
    const query = `
        UPDATE gift_map
        SET status_contato = ?
        WHERE id = ?
    `;
    const params = [newStatus, id];

    try {
        const [result] = await connection.query(query, params);
        if (result.affectedRows === 0) {
            throw new Error('Gift Map not found');
        }
        return result;
    } catch (err) {
        throw new Error('Erro ao atualizar o status do Gift Map: ' + err.message);
    }
};

module.exports = {
    getGiftMap,
    addGiftMap,
    getAllGiftMaps,
    deleteGiftMapById,
    getGiftMapById,
    updateGiftMapStatusById,
};
