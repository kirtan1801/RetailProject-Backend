const Product = require('../model/productsModels');
const Review = require('../model/reviewModel');

exports.createProduct = async (req, res, next) => {
    try {
        const data = await Product.create({
            productName: req.body.productName,
            category: req.body.category,
            price: req.body.price,
            brand: req.body.brand,
            description: req.body.description,
            averageRating: req.body.averageRating,
            totalRatings: req.body.totalRatings,
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

exports.getAllProducts = async (req, res, next) => {
    try {
        //for filter the data
        const queryObj = JSON.stringify(req.query);
        console.log(JSON.parse(queryObj));
        const data = await Product.findAll({ where: JSON.parse(queryObj) });

        res.status(200).json({
            status: 'success',
            result: {
                totalData: data.length,
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

exports.deactiveProductByID = async (req, res, next) => {
    try {
        const data = await Product.findOne({ where: { id: req.params.id } });
        data.active = 0;
        await data.save();
        res.status(204).json({
            status: 'success',
            message: data,
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};
