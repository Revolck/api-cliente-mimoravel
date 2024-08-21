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
      CASE
        WHEN MONTH(data_criacao) = 1 THEN 'Janeiro'
        WHEN MONTH(data_criacao) = 2 THEN 'Fevereiro'
        WHEN MONTH(data_criacao) = 3 THEN 'Março'
        WHEN MONTH(data_criacao) = 4 THEN 'Abril'
        WHEN MONTH(data_criacao) = 5 THEN 'Maio'
        WHEN MONTH(data_criacao) = 6 THEN 'Junho'
        WHEN MONTH(data_criacao) = 7 THEN 'Julho'
        WHEN MONTH(data_criacao) = 8 THEN 'Agosto'
        WHEN MONTH(data_criacao) = 9 THEN 'Setembro'
        WHEN MONTH(data_criacao) = 10 THEN 'Outubro'
        WHEN MONTH(data_criacao) = 11 THEN 'Novembro'
        WHEN MONTH(data_criacao) = 12 THEN 'Dezembro'
      END AS month,
      COUNT(*) AS 'Novo Lead'
    FROM gift_map
    WHERE status_contato = 'Novo Lead'
    AND YEAR(data_criacao) = YEAR(CURDATE())
    GROUP BY MONTH(data_criacao), YEAR(data_criacao)
  `);
  return rows;
};

module.exports = { getNewLeadsByWeek, getNewLeadsByMonth };
