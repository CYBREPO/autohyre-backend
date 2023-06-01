const express = require('express');
const controller = require('../controller/location-controller')
const router = express.Router();
// const store = require('../middleware/multer')

exports.router = router.get("/getAllLOcation",controller.getAllLOcation)
                        .get("/getLocationVechile",controller.getLocationVechile)
                        .post("/setLocationMapping",controller.setLocationMapping)
                        .post("/setLocation",controller.setLocation);