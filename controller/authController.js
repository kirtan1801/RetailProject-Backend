const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: hashed,
        });
        res.status(201).json({
            status: 'success',
            data: {
                newUser,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        const hashed = await bcrypt.compare(req.body.password, user.password);
        if (hashed) {
            res.status(200).json({
                status: 'success',
                data: {
                    user,
                },
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'user not found',
            });
        }
    } catch (err) {
        console.log(req.body);
        res.status(400).json({
            status: 'failed',
            message: err,
        });
    }
};

// exports.forgotPassword
