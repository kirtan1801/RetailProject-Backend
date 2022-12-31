const User = require('../model/userModel');
const factory = require('./handlerFactory');

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
        //need to optimize this
        if (req.body.name) {
            data.name = req.body.name;
        }
        if (req.body.address) {
            data.address = req.body.address;
        }
        if (req.body.city) {
            data.city = req.body.city;
        }
        if (req.body.pincode) {
            data.pincode = req.body.pincode;
        }
        if (req.body.country) {
            data.country = req.body.country;
        }
        if (req.body.email || req.body.phone || req.body.password) {
            res.satatus(400).json({
                status: 'failed',
                message: 'email and phone number can not be changed.',
            });
        }
        if (req.body.password) {
            res.status(400).json({
                status: 'failed',
                message: 'Password cannot changed from here',
            });
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
            message: 'Something went wrong',
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
