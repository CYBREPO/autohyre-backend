const express = require('express');
const controller = require('../controller/host-controller')
const router = express.Router();
const store = require('../middleware/multer')

const hostUpload = store.store.fields([{ name: 'profile', maxCount: 1 }, { name: 'carPhotos', maxCount: 8 }]);

exports.router = router.post("/createHost",hostUpload,controller.createHost)
                        .get("/getAllHost",controller.getAllHost)
                        .post("/updateHostStatus",controller.updateHostStatus);