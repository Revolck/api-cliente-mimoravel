const connection = require('../config/db');

// Função para obter novos leads por semana
const getNewLeadsByWeek = async () => {
  const [rows] = await connection.query(`
    SELECT DAYOFWEEK(data_criacao) AS day, COUNT(*) AS 'Novo Lead'
    FROM gift_map
    WHERE status_contato = 'Novo Lead'
    AND data_criacao >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY
    GROUP BY DAYOFWEEK(data_criacao)
  `);
  return rows;
};

// Função para obter novos leads por mês
const getNewLeadsByMonth = async () => {
  const [rows] = await connection.query(`
    SELECT DATE_FORMAT(data_criacao, '%M/%Y') AS month, COUNT(*) AS 'Novo Lead'
    FROM gift_map
    WHERE status_contato = 'Novo Lead'
    AND YEAR(data_criacao) = YEAR(CURDATE())
    GROUP BY DATE_FORMAT(data_criacao, '%Y-%m')
  `);
  return rows;
};

module.exports = { getNewLeadsByWeek, getNewLeadsByMonth };