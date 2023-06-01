const express = require('express');
const router = express.Router();
const controller = require('../controller/vehicle-controller')



exports.router = router.post("/sendemail", controller.sendMail);