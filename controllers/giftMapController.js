const giftMapService = require('../services/giftMapService');

exports.getGiftMap = async (req, res, next) => {
    try {
        const giftMaps = await giftMapService.getGiftMap();
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
