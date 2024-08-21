const chartGiftMapService = require('../services/chartGiftMapService');

exports.getNewLeadsByWeek = async (req, res) => {
  try {
    const leads = await chartGiftMapService.getNewLeadsByWeek();
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados de leads' });
  }
};

exports.getNewLeadsByMonth = async (req, res) => {
  try {
    const leads = await chartGiftMapService.getNewLeadsByMonth();
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados de leads' });
  }
};