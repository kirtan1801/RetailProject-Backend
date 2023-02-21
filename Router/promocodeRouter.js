const express = require('express');
const promocodeController = require('../controller/promocodeController');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/')
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        promocodeController.createPromocode
    )
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        promocodeController.getAllPromocode
    )

    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        promocodeController.bulkDeactivatePromocode
    );

router
    .route('/:id')
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        promocodeController.deletePromocode
    );
module.exports = router;
