const Cart = require('../model/cartModel');
const Product = require('../model/productsModels');
const fact = require('./handlerFactory');
const { Op } = require('sequelize');
const db = require('../utils/database');

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

exports.addToCartForRefund = async (req, res, next) => {
    try {
        const saleOrderCart = await Cart.findAll({
            where: {
                orderFlag: 1,
                idUser: req.user.id,
                idProduct: req.body.idProduct,
            },
        });
        let totalQuantity = 0;
        let temp = saleOrderCart.forEach((Object) => {
            totalQuantity += Object.quantity;
        });
        const prodcutDetails = await Product.findOne({
            where: { id: req.body.idProduct },
        });
        const oldData = await Cart.findOne({
            where: {
                idUser: req.user.id,
                idProduct: req.body.idProduct,
                orderFlag: 2,
            },
        });
        if (oldData) {
            if (totalQuantity < req.body.quantity + oldData.quantity * -1) {
                res.status(400).json({
                    status: 'failed',
                    message: 'total quantity is more then refund quantity',
                });
            } else {
                oldData.quantity -= req.body.quantity;
                oldData.total = oldData.quantity * prodcutDetails.price;
                await oldData.save();
                res.status(200).json({
                    status: 'success',
                    data: {
                        data: oldData,
                    },
                });
            }
        } else {
            if (totalQuantity < req.body.quantity) {
                res.status(400).json({
                    status: 'failed',
                    message: 'total quantity is more then refund quantity',
                });
            } else {
                const data = await Cart.create({
                    idUser: req.user.id,
                    idProduct: req.body.idProduct,
                    quantity: req.body.quantity * -1,
                    total: req.body.quantity * prodcutDetails.price * -1,
                    orderFlag: 2,
                });
                res.status(201).json({
                    status: 'success',
                    data: {
                        data,
                    },
                });
            }
        }
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.analysisGraph = async (req, res, next) => {
    try {
        const data = await db.query(
            'SELECT sum(total)as total, createdAt as date, count(*) as count FROM retail.carts  group by createdAt'
        );
        const totalsaleOrder = await db.query(
            'SELECT sum(total)as total, createdAt as date, count(*) as count FROM retail.carts where orderFlag = 1 group by createdAt'
        );
        const totalreturnOrder = await db.query(
            'SELECT sum(total)as total, createdAt as date, count(*) as count FROM retail.carts where orderFlag = 3 group by createdAt'
        );
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
            totalsaleOrder: {
                totalsaleOrder,
            },
            totalreturnOrder: {
                totalreturnOrder,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            status: 'failed',
            error: err,
        });
    }
};
