const express = require('express');

const orderController = require('../controller/orderController');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/')
    .post(authController.protect, orderController.createOrder)
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        orderController.getAllOrder
    );

router.route('/:id').get(orderController.getOrderByid);

module.exports = router;
