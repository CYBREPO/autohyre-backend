const express = require('express');
const router = express.Router();
const controller = require('../controller/vehicle-controller')
const { validateToken } = require('../middleware/authorization');


router.use(validateToken);
exports.router = router.post("/sendemail", controller.sendMail);