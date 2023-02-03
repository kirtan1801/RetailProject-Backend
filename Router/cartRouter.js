const express = require('express');

const cartController = require('../controller/cartController');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/')
    .post(authController.protect, cartController.addToCart)
    .delete(authController.protect, cartController.removeFromCart)
    .get(authController.protect, cartController.viewCart);
module.exports = router;
