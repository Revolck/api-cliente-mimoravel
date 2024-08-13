const connection = require('../config/db');

const getGiftMap = async () => {
    try {
        const [rows] = await connection.query('SELECT * FROM gift_map');
        return rows;
    } catch (err) {
        throw new Error('Erro ao obter respostas do quizz: ' + err.message);
    }
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

module.exports = {
    getGiftMap,
    addGiftMap
};
