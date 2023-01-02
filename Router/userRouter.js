const express = require('express');

const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router
    .route('/')
    .post(authController.signup)
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getAllUser
    );

// router.post('/forgotPassword', authController.forgotPassword);

router.route('/login').post(authController.login);

// router.use(authController.protect);

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateProfile)
    .delete(authController.deactivateUserByID);

module.exports = router;
