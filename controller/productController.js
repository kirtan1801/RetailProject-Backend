const Product = require('../model/productsModels');
const Review = require('../model/reviewModel');
const fact = require('./handlerFactory');

exports.createProduct = fact.createOne(Product);
exports.deleteProductById = fact.deleteOne(Product);
exports.getAllProducts = fact.getAll(Product);

exports.getProductByID = async (req, res, next) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.id } });
        const review = await Review.findAll({
            where: { idProduct: req.params.id },
        });
        res.status(200).json({
            status: 'success',
            data: {
                product,
                totalReviews: review.length,
                reviews: review,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};

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
