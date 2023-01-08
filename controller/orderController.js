const Order = require('../model/orderModel');
const Product = require('../model/productsModels');

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
        console.log(data);
        res.status(201).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        // console.log(data);
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.getAllOrder = async (req, res, next) => {
    try {
        const data = await Order.findAll();
        res.status(200).json({
            status: 'success',
            result: {
                data,
            },
        });
    } catch (err) {
        res.status(400).json({
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
