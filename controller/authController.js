const bcrypt = require('bcrypt');
const { promisify } = require('util');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN,
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOpetions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    res.cookie('jwt', token, cookieOpetions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'Success',
        token,
        data: {
            user,
        },
    });
};

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(`token: ${token}`);
    if (!token) {
        return next(
            res.status(404).json({
                status: 'failed',
                message: 'You are not logged in...',
            })
        );
    }
    const dcode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const freshUser = await User.findOne({ where: { id: dcode.id } });
    if (!freshUser) {
        return next(
            res.status(401).json({
                status: 'failed',
                error: 'The user belonging to the token does not exist',
            })
        );
    }
    req.user = freshUser;
    // console.log(`freshUser : ${freshUser}`);
    next();
};

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        console.log(`req.user.role: ${req.user.role}`);
        if (!roles.includes(req.user.role)) {
            return next(
                res.status(403).json({
                    status: 'failed',
                    message: 'You do not have permission this action',
                })
            );
        }
        next();
    };

exports.signup = async (req, res, next) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            alternateNumber: req.body.alternateNumber,
            address: req.body.address,
            role: req.body.role,
            password: hashed,
        });
        createSendToken(newUser, 201, res);
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
            createSendToken(user, 200, res);
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'Wrong Password',
            });
        }
    } catch (err) {
        console.log(req.body);
        res.status(404).json({
            status: 'failed',
            message: 'User not found',
        });
    }
};

exports.deactivateUserByID = async (req, res, next) => {
    try {
        const data = await User.findOne({ where: { id: req.params.id } });
        // console.log(data);
        data.active = 0;
        await data.save();
        res.status(204).json({
            status: 'success',
            message: 'You account is deactivated',
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            error: err,
        });
    }
};
