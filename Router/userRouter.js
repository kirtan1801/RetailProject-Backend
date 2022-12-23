const express = require('express');

const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.route('/').post(authController.signup).get(userController.getAllUser);

router.route('/login').post(authController.login);

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateProfile);

module.exports = router;
