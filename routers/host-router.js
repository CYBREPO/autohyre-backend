const express = require('express');
const controller = require('../controller/host-controller')
const router = express.Router();
const store = require('../middleware/multer');
const { validateToken } = require('../middleware/authorization');

const hostUpload = store.store.fields([{ name: 'ownerProfile', maxCount: 1 },{ name: 'driverProfile', maxCount: 1 }, { name: 'carPhotos', maxCount: 50}]);

exports.router = router.post("/createHost",validateToken,hostUpload,controller.createHost)
                        .get("/getAllHost",controller.getAllHost)
                        .post("/updateHostStatus",controller.updateHostStatus);