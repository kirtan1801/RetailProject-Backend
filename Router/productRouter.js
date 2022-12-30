const express = require('express');

const productController = require('../controller/productController');

const router = express.Router();

router
    .route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct);

// router.route('/:id').get(productController.getProductById);

module.exports = router;
