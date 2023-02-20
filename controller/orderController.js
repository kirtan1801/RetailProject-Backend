const Order = require('../model/orderModel');
const Product = require('../model/productsModels');
const fact = require('./handlerFactory');
const { Op } = require('sequelize');
const Cart = require('../model/cartModel');

exports.getOrderByid = async (req, res, next) => {
    try {
        const data = await Order.findOne({ where: { id: req.params.id } });
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};
exports.deleteOrder = fact.deleteOne(Order);

exports.getAllOrder = async (req, res, next) => {
    try {
        const queryObj = JSON.stringify(req.query);
        const data = await Order.findAll({ where: JSON.parse(queryObj) });
        console.log(Date.now());
        console.log(data);
        const countTillLast7Days = await Order.count({
            where: {
                createdAt: {
                    [Op.gte]: Date.now() - 7 * 24 * 60 * 60 * 1000,
                },
            },
        });
        const countTillLast30Days = await Order.count({
            where: {
                createdAt: {
                    [Op.gte]: Date.now() - 30 * 24 * 60 * 60 * 1000,
                },
            },
        });
        res.status(200).json({
            status: 'success',
            countTillLast7Days,
            countTillLast30Days,
            totalCount: data.length,
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
        });
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const OrderJson = await Cart.findAll({
            where: {
                idUser: req.user.id,
                orderFlag: false,
            },
        });
        let sum = 0;
        let temp = OrderJson.forEach((object) => {
            sum += object.total;
            object.orderFlag = true;
        });
        const data = await Order.create({
            idUser: req.user.id,
            orderType: 'saleOrder',
            orderJson: OrderJson,
            grandTotal: sum,
        });
        await Cart.update(
            { orderFlag: true },
            {
                where: {
                    idUser: req.user.id,
                },
            }
        );
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            error: err,
        });
    }
};

exports.getOrderByUser = async (req, res, next) => {
    try {
        const data = await Order.findAll({
            where: { idUser: req.user.id },
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
            error: err,
        });
    }
};

exports.returnOrder = async (req, res, next) => {
    try {
        const returnOrderJson = await Cart.findAll({
            where: {
                idUser: req.user.id,
                orderFlag: 2,
            },
        });
        if (!returnOrderJson) {
            res.status(404).json({
                status: 'failed',
                message: 'You can not refund a product without buying it',
            });
        }
        // const prodcutDetails = await Product.findOne({
        //     where: { id: req.body.idProduct },
        // });
        let sum = 0;
        let temp = returnOrderJson.forEach((object) => {
            sum += object.total;
        });
        const data = await Order.create({
            idUser: req.user.id,
            orderType: 'returnOrder',
            orderJson: returnOrderJson,
            grandTotal: sum,
        });
        await Cart.update(
            { orderFlag: 3 },
            {
                where: {
                    idUser: req.user.id,
                    orderFlag: 2,
                },
            }
        );
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            error: err,
        });
    }
};
