const express = require('express');
const accountController = require('../controller/user-controller');

const router = express.Router();


exports.router = router.post('/login', accountController.login)
                        .post('/register', accountController.registerUser)
                        .post('/reset-password', accountController.resetPassword)
                        .post('/updatePassword',accountController.updatePassword);