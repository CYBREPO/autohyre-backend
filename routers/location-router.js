const express = require('express');
const controller = require('../controller/location-controller')
const router = express.Router();
const { validateToken } = require('../middleware/authorization');
// const store = require('../middleware/multer')

// router.use(validateToken);
exports.router = router.get("/getAllLOcation",controller.getAllLOcation)
                        .get("/getLocationVechile",controller.getLocationVechile)
                        .post("/setLocationMapping",validateToken,controller.setLocationMapping)
                        .post("/setLocation",controller.setLocation);