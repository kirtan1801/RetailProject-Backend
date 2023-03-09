const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const fact = require('./handlerFactory');

exports.getAllUser = fact.getAll(User);
exports.deleteUser = fact.deleteOne(User);

exports.updateProfile = catchAsync(async (req, res, next) => {
    const data = await User.findByPk(req.params.id);
    //need to optimize this
    if (req.body.name) {
        data.name = req.body.name;
    }
    if (req.body.addressLine1) {
        data.addressLine1 = req.body.addressLine1;
    }
    if (req.body.addressLine2) {
        data.addressLine1 = req.body.addressLine2;
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
});

exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ where: { id: req.params.id } });
    res.status(200).json({
        status: 'success',
        result: {
            user,
        },
    });
});

exports.topCities = catchAsync(async (req, res, next) => {
    const data = await User.sequelize.query(
        'SELECT distinct city FROM retail.users '
    );
    res.status(200).json({
        status: 'success',
        data,
    });
});
