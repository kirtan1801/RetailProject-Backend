const Review = require('../model/reviewModel');
const Product = require('../model/productsModels');
const fact = require('./handlerFactory');
const User = require('../model/userModel');
const Cart = require('../model/cartModel');

exports.createReview = async (req, res, next) => {
    try {
        const productDetails = await Product.findOne({
            where: { id: req.body.idProduct },
        });
        const givenUser = await User.findOne({
            where: { id: req.user.id },
        });
        const givenProduct = await Cart.findOne({
            where: {
                orderFlag: true,
                idUser: req.user.id,
                idProduct: productDetails.id,
            },
        });
        const temp = await Review.findAll({
            where: { idUser: req.user.id, idProduct: req.body.idProduct },
        });
        if (!givenUser) {
            res.status(404).json({
                status: 'failed',
            });
        } else if (!givenProduct) {
            res.status(404).json({
                status: 'failed',
            });
        } else if (temp != 0) {
            res.status(400).json({
                status: 'failed',
                message:
                    'You have reviewed this product previously. You can not review this product another time',
            });
        } else {
            const data = await Review.create({
                idProduct: productDetails.id,
                idUser: req.user.id,
                rating: req.body.rating,
                description: req.body.description,
            });
            let totalRatingSum =
                productDetails.averageRating * productDetails.totalRatings;
            productDetails.averageRating =
                (await (totalRatingSum + data.rating)) /
                (productDetails.totalRatings + 1);
            console.log(productDetails.averageRating);
            productDetails.totalRatings += 1;
            await productDetails.save();
            res.status(201).json({
                status: 'success',
                data: {
                    data,
                },
            });
        }
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
        const data = await Review.findOne({
            where: {
                idUser: req.user.id,
                idProduct: req.body.idProduct,
            },
        });
        if (req.body.rating) {
            const productDetails = await Product.findOne({
                where: { id: req.body.idProduct },
            });
            const totalReviewSum =
                productDetails.averageRating * productDetails.totalRatings -
                data.rating;

            const temp =
                (totalReviewSum + req.body.rating) /
                productDetails.totalRatings;
            console.log(temp);
            await Review.update(
                { rating: req.body.rating },
                {
                    where: {
                        idUser: req.user.id,
                        idProduct: req.body.idProduct,
                    },
                }
            );
            await Product.update(
                { averageRating: temp },
                {
                    where: { id: req.body.idProduct },
                }
            );
        }
        if (req.body.description) {
            await Review.update(
                { description: req.body.description },
                {
                    where: {
                        idUser: req.user.id,
                        idProduct: req.body.idProduct,
                    },
                }
            );
        }
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
