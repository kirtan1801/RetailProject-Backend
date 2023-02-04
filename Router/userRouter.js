const express = require('express');

const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router
    .route('/delete')
    .delete(authController.protect, authController.deactivateUser);

router
    .route('/')
    .post(authController.signup)
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getAllUser
    );

router.route('/login').post(authController.login);
router.route('/forgotPassword').patch(authController.forgotPassword);
router.route('/resetPassword').patch(authController.resetPassword);
router
    .route('/topCities')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.topCities
    );

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateProfile)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.deleteUser
    );

module.exports = router;
