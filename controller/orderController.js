const Order = require('../model/orderModel');
const Product = require('../model/productsModels');
const fact = require('./handlerFactory');
const { Op } = require('sequelize');
const Cart = require('../model/cartModel');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getOrderByid = catchAsync(async (req, res, next) => {
    const data = await Order.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: User,
                attributes: ['name', 'email', 'phoneNumber'],
            },
        ],
    });
    res.status(200).json({
        status: 'success',
        data: {
            data,
        },
    });
});

exports.deleteOrder = fact.deleteOne(Order);

exports.getAllOrder = catchAsync(async (req, res, next) => {
    const queryObj = JSON.stringify(req.query);
    const data = await Order.findAll({
        where: JSON.parse(queryObj),
        include: [
            {
                model: User,
                attributes: ['name', 'email', 'phoneNumber'],
            },
        ],
    });
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
});

exports.createOrder = catchAsync(async (req, res, next) => {
    const OrderJson = await Cart.findAll({
        where: {
            idUser: req.user.id,
            orderFlag: false,
        },
        attributes: ['id', 'idProduct', 'quantity', 'idPromocode', 'total'],
    });
    let sum = 0;
    let temp = OrderJson.forEach((object) => {
        sum += object.total;
        object.orderFlag = true;
    });
    const data = await Order.create(
        {
            idUser: req.user.id,
            orderType: 'saleOrder',
            orderJson: OrderJson,
            grandTotal: sum,
        },
        {
            include: [
                {
                    model: User,
                    attributes: ['name', 'email', 'phoneNumber'],
                },
            ],
        }
    );
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
});

exports.getOrderByUser = catchAsync(async (req, res, next) => {
    const data = await Order.findAll({
        where: { idUser: req.user.id },
        include: [
            {
                model: User,
                attributes: ['name', 'email', 'phoneNumber'],
            },
        ],
    });
    res.status(200).json({
        status: 'success',
        data: {
            data,
        },
    });
});

exports.returnOrder = catchAsync(async (req, res, next) => {
    const returnOrderJson = await Cart.findAll({
        where: {
            idUser: req.user.id,
            orderFlag: 2,
        },
        attributes: ['id', 'idProduct', 'quantity', 'idPromocode', 'total'],
    });
    if (!returnOrderJson) {
        res.status(404).json({
            status: 'failed',
            message: 'You can not refund a product without buying it',
        });
    }
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
});
