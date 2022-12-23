const User = require('../model/userModel');

exports.getAllUser = async (req, res, next) => {
    try {
        const allUsers = await User.findAll();
        res.status(200).json({
            status: 'success',
            result: {
                allUsers,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const data = await User.findByPk(req.params.id);
        if (req.body.name) {
            data.name = req.body.name;
        }
        if (req.body.email) {
            data.email = req.body.email;
        }
        await data.save();
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: 'No user found',
        });
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        res.status(200).json({
            status: 'success',
            result: {
                user,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};
