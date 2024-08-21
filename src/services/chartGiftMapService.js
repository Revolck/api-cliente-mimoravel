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
    SELECT
      DATE_FORMAT(data_criacao, '%M') AS month_name,
      DATE_FORMAT(data_criacao, '%Y') AS year,
      COUNT(*) AS 'Novo Lead'
    FROM gift_map
    WHERE status_contato = 'Novo Lead'
    AND YEAR(data_criacao) = YEAR(CURDATE())
    GROUP BY DATE_FORMAT(data_criacao, '%Y-%m')
  `);
  return rows.map(row => ({
    month: translateMonth(row.month_name),
    year: row.year,
    'Novo Lead': row['Novo Lead']
  }));
};

// Função para traduzir o mês para português
const translateMonth = (month) => {
  const months = {
    'January': 'Janeiro',
    'February': 'Fevereiro',
    'March': 'Março',
    'April': 'Abril',
    'May': 'Maio',
    'June': 'Junho',
    'July': 'Julho',
    'August': 'Agosto',
    'September': 'Setembro',
    'October': 'Outubro',
    'November': 'Novembro',
    'December': 'Dezembro',
  };
  return months[month] || month;
};

module.exports = { getNewLeadsByWeek, getNewLeadsByMonth };
