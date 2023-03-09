const bcrypt = require('bcrypt');
const { promisify } = require('util');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const catchAsync = require('../utils/catchAsync');

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

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(
            res.status(404).json({
                status: 'failed',
                message: 'You are not logged in...',
            })
        );
    }
    const dcode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const freshUser = await User.findOne({
        where: { id: dcode.id, active: 1 },
    });
    if (!freshUser) {
        return next(
            res.status(401).json({
                status: 'failed',
                error: 'The user belonging to the token does not exist',
            })
        );
    }
    req.user = freshUser;
    next();
});

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
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

exports.signup = catchAsync(async (req, res, next) => {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        alternateNumber: req.body.alternateNumber,
        country: req.body.country,
        city: req.body.city,
        pincode: req.body.pincode,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        role: req.body.role,
        password: hashed,
    });
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    const hashed = await bcrypt.compare(req.body.password, user.password);
    if (hashed) {
        createSendToken(user, 200, res);
    } else {
        res.status(401).json({
            status: 'failed',
            message: 'Wrong Password',
        });
    }
});

exports.deactivateUser = catchAsync(async (req, res, next) => {
    const data = await User.update(
        { active: 0 },
        { where: { id: req.user.id } }
    );
    res.status(200).json({
        status: 'success',
        message: 'You account is deactivated',
    });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
        res.status(404).json({
            status: 'failed',
            message: 'User not found',
        });
    }
    const resetToken = signToken(user.id);
    const cookieOpetions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    res.cookie('jwt', resetToken, cookieOpetions);
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: 'kachhatrala181@gmail.com',
        to: user.email,
        subject: 'Password reset',
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
            Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="http://localhost:8002/reset/${resetToken}">http://localhost:8002/reset/${resetToken}</a>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`resetToken: ${resetToken}`);
        res.status(200).json({
            status: 'success',
            message: 'token sent to the mail',
        });
    } catch (err) {
        res.status(500).json({
            status: 'failed',
        });
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const data = await User.findOne({
        where: { email: req.body.email },
    });
    const hashed = await bcrypt.compare(req.body.oldPassword, data.password);
    if (hashed) {
        const newHashed = await bcrypt.hash(req.body.newPassword, 10);
        data.password = newHashed;
        await data.save();
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
        });
    } else {
        res.status(404).json({
            status: 'failed',
            message: 'Wrong Password',
        });
    }
});
