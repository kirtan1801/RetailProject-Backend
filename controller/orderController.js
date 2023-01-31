const Order = require('../model/orderModel');
const Product = require('../model/productsModels');
const fact = require('./handlerFactory');
const { Op } = require('sequelize');

exports.createOrder = async (req, res, next) => {
    try {
        const prodcutDetails = await Product.findOne({
            where: { id: req.body.idProduct },
        });
        const data = await Order.create({
            idUser: req.user.id,
            orderType: req.body.orderType,
            idProduct: prodcutDetails.id,
            quantity: req.body.quantity,
            grandTotal: req.body.quantity * prodcutDetails.price,
        });
        res.status(201).json({
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
