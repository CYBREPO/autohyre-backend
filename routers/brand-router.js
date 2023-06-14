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
                        //Model
                        .post("/getAllModels",controller.getAllModels)
                        //multiple model
                        .post("/setModels",validateToken,controller.setModels)
                        //single model
                        .post("/saveModel",validateToken,controller.saveModel)
                        .post("/updateModel",validateToken,controller.updateModel)
                        .get("/deleteModel",validateToken,controller.deleteModel);