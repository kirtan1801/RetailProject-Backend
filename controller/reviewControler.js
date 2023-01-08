const Review = require('../model/reviewModel');
const Product = require('../model/productsModels');

exports.createReview = async (req, res, next) => {
    try {
        const prodcutDetails = await Product.findOne({
            where: { id: req.body.idProduct },
        });
        const data = await Review.create({
            idProduct: prodcutDetails.id,
            idUser: req.user.id,
            rating: req.body.rating,
            description: req.body.description,
        });
        console.log(data);
        res.status(201).json({
            status: 'success',
            data: {
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

exports.getAllReview = async (req, res, next) => {
    try {
        const data = await Review.findAll();
        res.status(200).json({
            status: 'success',
            totalResult: data.length,
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            err: err,
        });
    }
};

exports.getReviewById = async (req, res, next) => {
    try {
        const data = await Review.findOne({ where: { id: req.params.id } });
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            err: err,
        });
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const data = Review.findPk(req.params.id);
        if (req.body.rating) {
            data.rating = req.body.rating;
        }
        if (req.body.description) {
            data.description = req.body.description;
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
        });
    }
};
