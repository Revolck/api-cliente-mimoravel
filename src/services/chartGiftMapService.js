const connection = require('../config/db');
const { format, addDays, startOfWeek } = require('date-fns');
const { ptBR } = require('date-fns/locale');

// Função para obter novos leads por semana
const getNewLeadsByWeek = async () => {
  const [rows] = await connection.query(`
    SELECT DATE_FORMAT(data_criacao, '%W') AS day_name, DATE_FORMAT(data_criacao, '%Y-%m-%d') AS date, COUNT(*) AS 'Novo Lead'
    FROM gift_map
    WHERE status_contato = 'Novo Lead'
    AND data_criacao >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY
    GROUP BY DATE_FORMAT(data_criacao, '%Y-%m-%d')
  `);

  const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const today = new Date();
  const startDate = startOfWeek(today, { locale: ptBR, weekStartsOn: 0 });

  const completeWeekData = weekDays.map((day, index) => {
    const found = rows.find(row => row.day_name === day);
    const date = found ? found.date : format(addDays(startDate, index), 'dd/MM');
    return {
      day: `${day} - ${date}`,
      'Novo Lead': found ? found['Novo Lead'] : 0,
    };
  });

  return completeWeekData;
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
