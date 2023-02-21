const Product = require('../model/productsModels');
const Review = require('../model/reviewModel');
const Cart = require('../model/cartModel.js');
const fact = require('./handlerFactory');
const { Op } = require('sequelize');
const exceljs = require('exceljs');

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

exports.exportProduct = async (req, res, next) => {
    try {
        const workBook = new exceljs.Workbook();
        const workSheet = workBook.addWorksheet('Products');
        workSheet.columns = [
            { header: 'id', key: 'id', width: 10 },
            { header: 'productName', key: 'productName', width: 10 },
            { header: 'category', key: 'category', width: 10 },
            { header: 'verient', key: 'verient', width: 10 },
            { header: 'price', key: 'price', width: 10 },
            { header: 'brand', key: 'brand', width: 10 },
            { header: 'averageRating', key: 'averageRating', width: 10 },
            { header: 'totalRatings', key: 'totalRatings', width: 10 },
            { header: 'active', key: 'active', width: 10 },
            { header: 'createdAt', key: 'createdAt', width: 10 },
            { header: 'updatedAt', key: 'updatedAt', width: 10 },
        ];
        const products = await Product.findAll();
        let counter = 1;
        let temp = products.forEach((product) => {
            product.id = counter;
            workSheet.addRow(product);
            counter++;
        });
        let nowDate = Date.now();
        workBook.xlsx
            .writeFile(`C:/Users/Kirtan/Downloads/products${nowDate}.xlsx`)
            .then(function () {
                console.log('Excel file generated successfully!');
                res.status(200).json({
                    status: 'success',
                });
            });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
        });
    }
};

exports.bulkdeactivateProduct = async (req, res, next) => {
    try {
        const data = req.body.id;
        await Product.update(
            { active: false },
            {
                where: { id: data },
            }
        );
        res.status(200).json({
            status: 'success',
            message: 'article deactivated successfully',
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            error: err,
        });
    }
};
