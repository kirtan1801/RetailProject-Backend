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
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        productController.updateProduct
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        productController.deleteProductById
    );

router.route('/trendingProduct').get(productController.trendingProduct);

router
    .route('/exportsToExcel')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        productController.exportProduct
    );

router
    .route('/deactivate')
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        productController.bulkdeactivateProduct
    );

module.exports = router;
