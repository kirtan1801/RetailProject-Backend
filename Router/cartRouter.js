const express = require('express');

const cartController = require('../controller/cartController');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/')
    .post(authController.protect, cartController.addToCart)
    .delete(authController.protect, cartController.removeFromCart)
    .get(authController.protect, cartController.viewCart);

router
    .route('/addPromocode')
    .post(authController.protect, cartController.addPromocodeToCart);

router
    .route('/refund')
    .post(authController.protect, cartController.addToCartForRefund);

router
    .route('/graph')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        cartController.analysisGraph
    );

module.exports = router;
