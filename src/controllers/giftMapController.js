const giftMapService = require('../services/giftMapService');

exports.getGiftMap = async (req, res, next) => {
    const { search } = req.query;

    try {
        const giftMaps = await giftMapService.getGiftMap(search);
        res.json(giftMaps);
    } catch (err) {
        next(err);
    }
};

exports.addGiftMap = async (req, res, next) => {
    try {
        const newGiftMap = await giftMapService.addGiftMap(req.body);
        res.status(201).json(newGiftMap);
    } catch (err) {
        next(err);
    }
};

exports.getAllGiftMaps = async (req, res) => {
    try {
      const giftMaps = await giftMapService.getAllGiftMaps();
      res.status(200).json(giftMaps);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar os dados do gift_map' });
    }
  };
