const userService = require('../services/userService');

exports.addUser = async (req, res, next) => {
    try {
        const newUser = await userService.addUser(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
};
