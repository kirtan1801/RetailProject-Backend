const Cart = require('../model/cartModel');
const Product = require('../model/productsModels');
const fact = require('./handlerFactory');
const { Op } = require('sequelize');

exports.addToCart = async (req, res, next) => {
    try {
        const prodcutDetails = await Product.findOne({
            where: { id: req.body.idProduct },
        });
        const oldData = await Cart.findOne({
            where: {
                idUser: req.user.id,
                idProduct: prodcutDetails.id,
                orderFlag: false,
            },
        });
        if (oldData) {
            oldData.quantity = oldData.quantity + req.body.quantity;
            oldData.total = oldData.quantity * prodcutDetails.price;
            await oldData.save();
            res.status(200).json({
                status: 'success',
                data: {
                    data: oldData,
                },
            });
        } else {
            const data = await Cart.create({
                idUser: req.user.id,
                idProduct: prodcutDetails.id,
                quantity: req.body.quantity,
                total: req.body.quantity * prodcutDetails.price,
            });
            res.status(201).json({
                status: 'success',
                data: {
                    data,
                },
            });
        }
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const givenUser = await Cart.findOne({
            where: {
                idUser: req.user.id,
                idProduct: req.body.idProduct,
                orderFlag: false,
            },
        });
        const prodcutDetails = await Product.findOne({
            where: { id: req.body.idProduct },
        });
        if (!givenUser) {
            res.status(404).json({
                status: 'failed',
                message: 'item not found',
            });
        }
        if (req.body.quantity === givenUser.quantity) {
            const data = await Cart.destroy({
                where: { id: givenUser.id },
            });
            res.status(204).json({
                status: 'success',
                data: {
                    data,
                },
            });
        } else if (req.body.quantity < givenUser.quantity) {
            givenUser.quantity = givenUser.quantity - req.body.quantity;
            givenUser.total = givenUser.quantity * prodcutDetails.price;
            await givenUser.save();
            res.status(200).json({
                status: 'success',
                data: {
                    data: givenUser,
                },
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: `only ${givenUser.quantity} quantity available`,
            });
        }
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.viewCart = async (req, res, next) => {
    try {
        const data = await Cart.findAll({
            where: { idUser: req.user.id, orderFlag: false },
        });
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            err: err,
        });
    }
};
