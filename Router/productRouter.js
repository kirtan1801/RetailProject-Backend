const express = require('express');

const productController = require('../controller/productController');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct);

router
    .route('/:id')
    .get(productController.getProductByID)
    .patch(productController.updateProduct);

module.exports = router;
