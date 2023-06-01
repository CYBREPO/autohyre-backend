const express = require('express');
const controller = require('../controller/brand-controller')
const router = express.Router();
const store = require('../middleware/multer')

exports.router = router.get("/getBrands",controller.getBrands)
                        .post("/getAllBrands",controller.getAllBrands)
                        .post("/setBrands",store.store.single('image'),controller.setBrands);