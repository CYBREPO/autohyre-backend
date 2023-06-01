const express = require('express');
const controller = require('../controller/vehicle-controller')
const router = express.Router();
const store = require('../middleware/multer')

exports.router = router.get("/getVehicle",controller.getVehicleDetails)
                        .get("/getAdditionDetails",controller.getAdditionDetails)
                        .post("/setVehicleDetails",store.store.array('images'),controller.setVehicleDetails)
                        .post("/getFilteredVehicleDetails",controller.getFilteredVehicleDetails);