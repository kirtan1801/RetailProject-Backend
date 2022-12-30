const Product = require('../model/productsModels');

exports.createProduct = async (req, res, next) => {
    try {
        const data = await Product.create({
            productName: req.body.productName,
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
        const data = await Product.findAll();
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
