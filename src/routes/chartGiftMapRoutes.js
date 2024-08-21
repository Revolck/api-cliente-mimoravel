const express = require('express');
const router = express.Router();
const { getNewLeadsByWeek, getNewLeadsByMonth } = require('../services/chartGiftMapRoutes');

// Rota para obter novos leads por semana
router.get('/leads/week', async (req, res) => {
  try {
    const leads = await getNewLeadsByWeek();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados de leads' });
  }
});

// Rota para obter novos leads por mês
router.get('/leads/month', async (req, res) => {
  try {
    const leads = await getNewLeadsByMonth();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados de leads' });
  }
});

module.exports = router;
