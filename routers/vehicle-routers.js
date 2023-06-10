const express = require('express');
const controller = require('../controller/vehicle-controller')
const router = express.Router();
const store = require('../middleware/multer');
const { validateToken } = require('../middleware/authorization');

// router.use(validateToken);
exports.router = router.get("/getVehicle",controller.getVehicleDetails)
                        .post("/getVehicles",controller.getVehicles)
                        .get("/getAdditionDetails",controller.getAdditionDetails)
                        .post("/setVehicleDetails",validateToken,store.store.array('images'),controller.setVehicleDetails)
                        .post("/getFilteredVehicleDetails",controller.getFilteredVehicleDetails);