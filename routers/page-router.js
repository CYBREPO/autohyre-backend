const express = require('express');
const router = express.Router();
const store = require('../middleware/multer');
const { validateToken } = require('../middleware/authorization');
const pageController = require('../controller/pages-controller');
const ourLinkController = require('../controller/ourList-controller');

const hostUpload = store.store.fields([{ name: 'bannerImg', maxCount: 1 }, { name: 'mainImg', maxCount: 1 }]);

exports.router =  router.get("/getPages",pageController.getPages)
                        .get("/deletePages",pageController.deletePages)
                        .post("/savePage", store.store.array("images"), pageController.savePage)
                        .post("/updatePage",validateToken, store.store.array("images"), pageController.updatePage)

                        .get("/getOurList",ourLinkController.getOurList)
                        .post("/saveOurLink",hostUpload,ourLinkController.saveOurLink)
                        .post("/updateOurList",hostUpload,ourLinkController.updateOurList)

                        .get("/getAboutus",pageController.getAboutus)
                        .post("/saveAboutus",hostUpload,pageController.saveAboutus)
                        .post("/updateAboutus",hostUpload,pageController.updateAboutus);
