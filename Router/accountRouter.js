const express = require('express');

const accountController = require('../controller/accountController');
const authController = require('../controller/authController');

const router = express.Router();

router
    .route('/')
    .post(authController.protect, accountController.createBankDetails);

module.exports = router;
