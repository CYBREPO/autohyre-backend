const express = require('express');
const controller = require('../controller/brand-controller')
const router = express.Router();
const store = require('../middleware/multer');
const { validateToken } = require('../middleware/authorization');

exports.router = router.get("/getBrandById",controller.getBrandById)
                        .post("/getAllBrands",controller.getAllBrands)
                        .post("/setBrands",validateToken,store.store.single('image'),controller.setBrands)
                        .post("/updateBrand",validateToken,store.store.single('image'),controller.updateBrand)
                        .post("/deleteBrand",validateToken,controller.deleteBrand)
                        .post("/setModels",validateToken,controller.setModels);