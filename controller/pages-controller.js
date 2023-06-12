const asyncHandler = require('express-async-handler');
const pageModel = require('../models/pages').page;
const constant = require('../constant/constant').constants;
const fileUploadController = require('./fileUpload-controller');


exports.getPages = asyncHandler(async (req, res) => {
    let result = await pageModel.find().exec();
    const totalCount = await pageModel.countDocuments();

    if (result) {
        return res.status(constant.OK).json({ success: true, data: result,count: totalCount});
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Something went wrong");
});

exports.deletePages = asyncHandler(async (req, res) => {
    if (req.query.id) {
        let result = pageModel.findByIdAndDelete(req.query.id).exec();

        if (result) {
            return res.status(constant.OK).json({ success: true, data: result });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Something went wrong");
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid Request");

});

exports.savePage = asyncHandler(async (req, res) => {
    if (req.body) {
        let images = [];
        if (req.files) {
            const arr = await fileUploadController.Uploads(req.files);

            arr.map((src, index) => {
                images.push({
                    filename: req.files[index].originalname,
                    contentType: req.files[index].mimetype,
                    imageBase64: src
                });
            });

        }

        let result = pageModel.create({
            name: req.body.name,
            description: req.body.description,
            images: images,

        });

        if (result)
            return res.status(constant.OK).json({ success: true, message: 'Data saved' });

        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid Request");
});

exports.updatePage = asyncHandler(async (req, res) => {
    if (req.body) {
        let images = [];
        if (req.files) {
            const arr = await fileUploadController.Uploads(req.files);

            arr.map((src, index) => {
                images.push({
                    filename: req.files[index].originalname,
                    contentType: req.files[index].mimetype,
                    imageBase64: src
                });
            });

        }

        let result = pageModel.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
            description: req.body.description,
            images: images,

        });

        if (result)
            return res.status(constant.OK).json({ success: true, message: 'Data saved' });

        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid Request");
});