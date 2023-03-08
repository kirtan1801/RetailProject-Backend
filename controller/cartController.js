const { Op } = require('sequelize');
const Cart = require('../model/cartModel');
const Product = require('../model/productsModels');
const Promocode = require('../model/promocodeModel');
const User = require('../model/userModel');
const fact = require('./handlerFactory');
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
            include: [
                {
                    model: User,
                    attributes: ['name', 'email', 'phoneNumber'],
                },
                {
                    model: Product,
                    attributes: [
                        'productName',
                        'category',
                        'varient',
                        'price',
                        'brand',
                    ],
                },
            ],
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
            const data = await Cart.create(
                {
                    idUser: req.user.id,
                    idProduct: prodcutDetails.id,
                    quantity: req.body.quantity,
                    total: req.body.quantity * prodcutDetails.price,
                },
                {
                    include: [
                        {
                            model: User,
                            as: 'user',
                        },
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                }
            );
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
            include: [
                {
                    model: User,
                    attributes: ['name', 'email', 'phoneNumber'],
                },
                {
                    model: Product,
                    attributes: [
                        'productName',
                        'category',
                        'varient',
                        'price',
                        'brand',
                    ],
                },
            ],
        });
        // console.log(givenUser.product.pr);
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
            include: [
                {
                    model: User,
                    attributes: ['name', 'email', 'phoneNumber'],
                },
                {
                    model: Product,
                    attributes: [
                        'productName',
                        'category',
                        'varient',
                        'price',
                        'brand',
                    ],
                },
            ],
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

exports.addPromocodeToCart = async (req, res, next) => {
    try {
        const promocodeId = await Promocode.findOne({
            where: {
                promocode: req.body.promocode,
                active: true,
                validTill: {
                    [Op.gte]: Date.now(),
                },
            },
        });
        const oldData = await Cart.findOne({
            where: {
                promocode: promocodeId.id,
                idUser: req.user.id,
            },
        });
        if (oldData) {
            res.status(400).json({
                status: 'failed',
                message: 'This promocode is already used',
            });
        } else {
            const data = await Cart.create({
                idUser: req.user.id,
                promocode: promocodeId.id,
                total: promocodeId.discount * -1,
                orderFlag: 0,
            });
            res.status(200).json({
                status: 'success',
                message: 'Promocode added successfully',
            });
        }
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            error: err,
        });
    }
};
