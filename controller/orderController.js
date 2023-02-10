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
                idProduct: req.body.idProduct,
            },
        });
        const prodcutDetails = await Product.findOne({
            where: { id: req.body.idProduct },
        });
        let sum = 0;
        let temp = returnOrderJson.forEach((Object) => {
            sum += Object.total;
        });
        const data = await Order.create({
            idUser: req.user.id,
            orderType: 'returnOrder',
            orderJson: returnOrderJson,
            grandTotal: -1 * sum,
        });
        const cartData = await Cart.create({
            idUser: req.user.id,
            idProduct: req.body.idProduct,
            quantity: req.body.quantity,
            total: req.body.quantity * prodcutDetails.price * -1,
            orderFlag: 2,
        });
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
            cartData: {
                cartData,
            },
        });
    } catch (err) {
        const cartData = await Cart.create({
            idUser: req.user.id,
            idProduct: req.body.idProduct,
            quantity: req.body.quantity,
            total: req.body.quantity * prodcutDetails.price * -1,
            orderFlag: 2,
        });
        console.log(JSON.stringify(cartData));
        res.status(400).json({
            status: 'failed',
            error: err,
        });
    }
};
