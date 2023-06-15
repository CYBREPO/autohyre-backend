const asyncHandler = require('express-async-handler');
const { constants } = require('../constant/constant');
const ourListModel = require('../models/ourLst').ourLists;

exports.getOurList = asyncHandler(async (req, res) => {
    const result = await ourListModel.findOne().exec();
    if (result) {
        return res.status(constants.OK).json({ success: true, data: result });
    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error("Not Found");
});

exports.saveOurLink = asyncHandler(async (req, res) => {
    if (req.body) {
        const { features } = req.body;
        const { bannerImg, mainImg } = req.files;


        let featuredArr = [];
        features.map((item, index) => {
            featuredArr.push({
                title: item.title,
                description: item.description,
            })
        });

        const result = await ourListModel.create({
            header: req.body.header,
            bannerImg: bannerImg[0].path.split('uploads\\')[1],
            mainImg: mainImg[0].path.split('uploads\\')[1],
            features: featuredArr,
            body: req.body.body,
            footer: req.body.footer,
        });

        if (result) {
            return res.status(constants.OK).json({ success: true, message: "our list saved successfully" });
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.updateOurList = asyncHandler(async (req, res) => {
    if (req.body) {

        const { features } = req.body;
        const { bannerImg, mainImg } = req.files;

        let featuredArr = [];
        features.map((item, index) => {
            featuredArr.push({
                title: item.title,
                description: item.description,
            })
        });

        let param = {
            header: req.body.header,
            features: featuredArr,
            body: req.body.body,
            footer: req.body.footer
        }

        if (bannerImg)
            param['bannerImg'] = bannerImg[0].path.split('uploads\\')[1];

        if (mainImg)
            param['mainImg'] = mainImg[0].path.split('uploads\\')[1];

        const result = await ourListModel.updateOne({ _id: req.body.id }, { $set: param });

        if (result) {
            return res.status(constants.OK).json({ success: true, message: "our list saved successfully" });
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});