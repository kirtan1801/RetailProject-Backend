const express = require('express');

const reviewController = require('../controller/reviewControler');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        reviewController.getAllReview
    )
    .post(authController.protect, reviewController.createReview);

router.route('/:id').get(reviewController.getReviewById);

// router.route('/:idUser').get(reviewController.getReviewByUser);

module.exports = router;
