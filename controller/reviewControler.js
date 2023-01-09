const Review = require('../model/reviewModel');
const Product = require('../model/productsModels');
const fact = require('./handlerFactory');

exports.createReview = async (req, res, next) => {
    try {
        const productDetails = await Product.findOne({
            where: { id: req.body.idProduct },
        });
        const data = await Review.create({
            idProduct: productDetails.id,
            idUser: req.user.id,
            rating: req.body.rating,
            description: req.body.description,
        });
        let totalRatingSum = await Review.sum('rating', {
            where: { idProduct: data.idProduct },
        });
        let numberOfRating = await Review.count({
            where: { idProduct: data.idProduct },
        });
        await Product.update(
            {
                totalRatings: numberOfRating,
                averageRating: totalRatingSum / numberOfRating,
            },
            { where: { id: user.idProduct } }
        );
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

exports.getAllReview = fact.getAll(Review);
