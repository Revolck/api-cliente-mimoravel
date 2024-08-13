const connection = require('../config/db');

const getTags = async () => {
    try {
        const [rows] = await connection.query('SELECT * FROM tags');
        return rows;
    } catch (err) {
        throw new Error('Erro ao obter tags: ' + err.message);
    }
};

const addTag = async (tagData) => {
    const { nome } = tagData;
    try {
        const [result] = await connection.query(
            'INSERT INTO tags (nome) VALUES (?)',
            [nome]
        );
        return { id: result.insertId };
    } catch (err) {
        throw new Error('Erro ao adicionar tag: ' + err.message);
    }
};

module.exports = {
    getTags,
    addTag
};
