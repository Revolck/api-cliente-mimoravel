const connection = require('../config/db');

// Função para obter novos leads por semana
const getNewLeadsByWeek = async () => {
  const [rows] = await connection.query(`
    SELECT DAYOFWEEK(date) AS day, COUNT(*) AS 'Novo Lead'
    FROM leads
    WHERE date >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY
    GROUP BY DAYOFWEEK(date)
  `);
  return rows;
};

// Função para obter novos leads por mês
const getNewLeadsByMonth = async () => {
  const [rows] = await connection.query(`
    SELECT DATE_FORMAT(date, '%M/%Y') AS month, COUNT(*) AS 'Novo Lead'
    FROM leads
    WHERE YEAR(date) = YEAR(CURDATE())
    GROUP BY DATE_FORMAT(date, '%Y-%m')
  `);
  return rows;
};

module.exports = { getNewLeadsByWeek, getNewLeadsByMonth };
