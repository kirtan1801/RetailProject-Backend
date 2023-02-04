const Product = require('../model/productsModels');
const Review = require('../model/reviewModel');
const Cart = require('../model/cartModel.js');
const fact = require('./handlerFactory');
const { Op } = require('sequelize');

exports.updateProduct = async (req, res, next) => {
    try {
        const data = await Product.findByPk(req.params.id);
        if (req.body.productName) {
            data.productName = req.body.productName;
        }
        if (req.body.category) {
            data.category = req.body.category;
        }
        if (req.body.price) {
            data.price = req.body.price;
        }
        if (req.body.brand) {
            data.brand = req.body.brand;
        }
        if (req.body.description) {
            data.description = req.body.description;
        }
        if (req.body.active) {
            data.active = req.body.active;
        }
        await data.save();
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: 'Something went wrong',
            error: err,
        });
    }
};

exports.trendingProduct = async (req, res, next) => {
    try {
        const data = await Cart.findAll({
            where: {
                orderFlag: true,
                createdAt: {
                    [Op.gte]: Date.now() - 7 * 24 * 60 * 60 * 100,
                },
            },
        });
        const productArr = [];
        data.forEach((Object) => {
            productArr.push(Object.idProduct);
        });
        const trendingProducts = await Product.findAll({
            where: {
                id: productArr,
            },
        });
        res.status(200).json({
            status: 'success',
            products: {
                products: trendingProducts,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            error: err,
        });
    }
};

exports.createProduct = fact.createOne(Product);
exports.deleteProductById = fact.deleteOne(Product);
exports.getAllProducts = fact.getAll(Product);
