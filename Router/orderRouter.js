const express = require('express');

const orderController = require('../controller/orderController');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/')
    .post(authController.protect, orderController.createOrder)
    .get(authController.protect, orderController.getOrderByUser);

router
    .route('/returnOrder')
    .post(authController.protect, orderController.returnOrder);

router
    .route('/getAll')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        orderController.getAllOrder
    );
router
    .route('/:id')
    .get(orderController.getOrderByid)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        orderController.deleteOrder
    );

module.exports = router;
