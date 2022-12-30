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
    try {
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
        const dcode = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        );
        next();
    } catch (err) {
        return next(
            res.status(404).json({
                status: 'failed',
                message: err,
            })
        );
    }
};

exports.signup = async (req, res, next) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            addressLine: req.body.addressLine,
            city: req.body.city,
            country: req.body.country,
            pincode: req.body.pincode,
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

//Need to implement restrict to functionality
// exports.resritctTo =
//     (...roles) =>
//     async (req, res, next) => {
//         const userRole = await User.findOne({ where: {email: }})
//         next();
//     };
