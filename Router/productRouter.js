const express = require('express');

const productController = require('../controller/productController');
const authController = require('../controller/authController');
const reviewControler = require('../controller/reviewControler');

const router = express.Router();

router
    .route('/')
    .get(productController.getAllProducts)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        productController.createProduct
    );

router
    .route('/:id')
    .get(productController.getProductByID)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        productController.updateProduct
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        productController.deactiveProductByID
    );

module.exports = router;
