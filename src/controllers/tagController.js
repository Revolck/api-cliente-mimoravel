const tagService = require('../services/tagService');

exports.getTags = async (req, res, next) => {
    try {
        const tags = await tagService.getTags();
        res.json(tags);
    } catch (err) {
        next(err);
    }
};

exports.addTag = async (req, res, next) => {
    try {
        const newTag = await tagService.addTag(req.body);
        res.status(201).json(newTag);
    } catch (err) {
        next(err);
    }
};
