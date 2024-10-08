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

exports.deleteGiftMap = async (req, res, next) => {
    const giftMapId = req.params.id;

    try {
        await giftMapService.deleteGiftMapById(giftMapId);
        res.status(200).json({ message: 'Gift Map e respondente associados deletados com sucesso.' });
    } catch (error) {
        next(error);
    }
};

exports.getGiftMapById = async (req, res, next) => {
    try {
        const giftMapId = req.params.id;
        const giftMapData = await giftMapService.getGiftMapById(giftMapId);
        if (!giftMapData) {
            return res.status(404).json({ message: 'Gift Map not found' });
        }
        res.status(200).json(giftMapData);
    } catch (error) {
        next(error);
    }
};

exports.updateGiftMapStatus = async (req, res, next) => {
    const giftMapId = req.params.id;
    const { status_contato } = req.body;

    try {
        await giftMapService.updateGiftMapStatusById(giftMapId, status_contato);
        res.status(200).json({ message: 'Status atualizado com sucesso!' });
    } catch (err) {
        next(err);
    }
};
