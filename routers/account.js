const express = require('express');
const accountController = require('../controller/user-controller');
const store = require('../middleware/multer');
const { validateToken } = require('../middleware/authorization');

const router = express.Router();


exports.router = router.post('/login', accountController.login)
                        .get('/deleteUser',validateToken, accountController.deleteUser)
                        .post('/getUsers', accountController.getUsers)
                        .post('/updateUserStatus',validateToken, accountController.updateUserStatus)
                        .post('/register', accountController.registerUser)
                        .post('/updateUser',validateToken,store.store.single('profile'),accountController.registerUser)
                        .post('/reset-password', accountController.resetPassword)
                        .post('/updatePassword',validateToken,accountController.updatePassword);