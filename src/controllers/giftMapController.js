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

exports.deleteGiftMap = (req, res, next) => {
    const respondentId = req.params.id;

    connection.beginTransaction((err) => {
        if (err) return next(err);

        // Deleta primeiro os dados da tabela gift_map
        connection.query(
            'DELETE FROM gift_map WHERE respondent_id = ?',
            [respondentId],
            (error, results) => {
                if (error) {
                    return connection.rollback(() => {
                        next(error);
                    });
                }

                // Agora deleta o respondent
                connection.query(
                    'DELETE FROM respondents WHERE id = ?',
                    [respondentId],
                    (error, results) => {
                        if (error) {
                            return connection.rollback(() => {
                                next(error);
                            });
                        }

                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    next(err);
                                });
                            }

                            res.status(200).json({ message: 'Respondente e dados do gift_map deletados com sucesso.' });
                        });
                    }
                );
            }
        );
    });
};