const express = require('express');
const controller = require('../controller/brand-controller')
const router = express.Router();
const store = require('../middleware/multer');
const { validateToken } = require('../middleware/authorization');

exports.router = router.get("/getBrands",controller.getBrands)
                        .post("/getAllBrands",controller.getAllBrands)
                        .post("/setBrands",validateToken,store.store.single('image'),controller.setBrands);