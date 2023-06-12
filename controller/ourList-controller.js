const asyncHandler = require('express-async-handler');
const { constants } = require('../constant/constant');
const ourListModel = require('../models/ourLst');
const fileUploadController = require('./fileUpload-controller');

exports.getOurList = asyncHandler(async (req,res) => {
    const result = await ourListModel.findOne().exec();
    if(result){
        res.status(constants.OK).json({success: true, data: result});
    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error("Not Found");
});

exports.saveOurLink = asyncHandler(async (req, res) => {
    if (req.body) {
        const { bannerImg, mainImg, features } = req.files;

        let banner = {};
        if (bannerImg) {
            const base64 = await fileUploadController.SingleUpload(brandImg);

            banner = {
                filename: bannerImg.originalname,
                contentType: bannerImg.mimetype,
                imageBase64: base64
            }

        }

        let mainImage = {};
        if (mainImg) {
            const base64 = await fileUploadController.SingleUpload(brandImg);

            mainImage = {
                filename: bannerImg.originalname,
                contentType: bannerImg.mimetype,
                imageBase64: base64
            }
        }

        let featuredArr = [];
        features.map((item, index) => {
            featuredArr.push({
                title: item.title,
                description: item.description,
            })
        });

        const result = await ourListModel.create({
            header: req.body.header,
            bannerImg: banner,
            mainImg: mainImage,
            features: featuredArr,
            body: req.body.body,
            footer: req.body.footer,
        });

        if(result){
            res.status(constants.OK).json({success: true, meesage: "our list saved successfully"});
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.updateOurList= asyncHandler(async (req, res) => {
    if (req.body) {
        const { bannerImg, mainImg, features } = req.files;

        let banner = {};
        if (bannerImg) {
            const base64 = await fileUploadController.SingleUpload(brandImg);

            banner = {
                filename: bannerImg.originalname,
                contentType: bannerImg.mimetype,
                imageBase64: base64
            }

        }

        let mainImage = {};
        if (mainImg) {
            const base64 = await fileUploadController.SingleUpload(brandImg);

            mainImage = {
                filename: bannerImg.originalname,
                contentType: bannerImg.mimetype,
                imageBase64: base64
            }
        }

        let featuredArr = [];
        features.map((item, index) => {
            featuredArr.push({
                title: item.title,
                description: item.description,
            })
        });

        const result = await ourListModel.findByIdAndUpdate(req.body.id,{
            header: req.body.header,
            bannerImg: banner,
            mainImg: mainImage,
            features: featuredArr,
            body: req.body.body,
            footer: req.body.footer,
        });

        if(result){
            res.status(constants.OK).json({success: true, meesage: "our list saved successfully"});
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});