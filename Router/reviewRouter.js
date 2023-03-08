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
    .post(authController.protect, reviewController.createReview)
    .patch(authController.protect, reviewController.updateReview);

router
    .route('/reviewByUser')
    .get(authController.protect, reviewController.getReviewByUser);

router.route('/:id').get(reviewController.getReviewById);

module.exports = router;
