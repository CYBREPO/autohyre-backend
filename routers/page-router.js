const express = require('express');
const router = express.Router();
const store = require('../middleware/multer');
const { validateToken } = require('../middleware/authorization');
const pageController = require('../controller/pages-controller');

exports.router =  router.get("/getPages",pageController.getPages)
                        .get("/deletePages",pageController.deletePages)
                        .post("/savePage", store.store.array("images"), pageController.savePage)
                        .post("/updatePage",validateToken, store.store.array("images"), pageController.updatePage);
